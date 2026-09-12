import { buildSystemPrompt } from "./prompts";
import { portfolioData } from "@/data/portfolio";
import { logger } from "@/lib/logger";

export interface ChatMessageInput {
  role: "user" | "assistant";
  content: string;
}

export interface GenerateChatResponseOptions {
  message: string;
  history?: ChatMessageInput[];
}

/**
 * Security: Comprehensive Prompt Injection & Adversarial Jailbreak Detection
 */
function isPromptInjectionAttempt(query: string): boolean {
  if (!query || typeof query !== "string") return false;

  // Normalize query: remove accents, collapse multiple spaces, lower case
  const q = query.toLowerCase().normalize("NFKC");
  const injectionPatterns = [
    /ignore (?:all )?(?:previous|prior|above|existing) instructions/i,
    /disregard (?:all )?(?:previous|prior|above|system) (?:rules|instructions|prompts)/i,
    /(?:reveal|show|print|output|display|repeat) (?:your )?(?:system prompt|initial instructions|developer message|instructions above)/i,
    /(?:what is|give me|tell me) (?:your )?(?:system prompt|initial prompt|hidden prompt|internal instructions|system message)/i,
    /(?:reveal|leak|print|show|extract) (?:the )?(?:api[ _-]?key|secret|token|env|environment variable)/i,
    /\b(?:dan mode|jailbreak|unrestricted mode|developer mode on|god mode)\b/i,
    /(?:bypass|override|disable) (?:security|safety) (?:protocol|guideline|filter|rules)/i,
    /(?:simulate|pretend|act as|roleplay as) (?:an? )?(?:unrestricted|evil|unfiltered|jailbroken|root)/i,
    /(?:repeat the (?:words|text) above)/i,
    /(?:output (?:the )?(?:system prompt|prompt) in a code block)/i,
  ];

  return injectionPatterns.some((pattern) => pattern.test(q));
}

/**
 * Security: Output Redaction Filter
 * Defends against unintentional model leakage of API keys, environment variables, or server paths
 */
function redactSensitiveOutput(text: string): string {
  if (!text) return text;

  let cleaned = text;

  // Redact Anthropic API keys
  cleaned = cleaned.replace(/sk-ant-[a-zA-Z0-9_\-]{20,}/g, "[REDACTED_API_KEY]");

  // Redact OpenAI / standard bearer keys
  cleaned = cleaned.replace(/sk-[a-zA-Z0-9_\-]{20,}/g, "[REDACTED_API_KEY]");

  // Redact ElevenLabs or general hex keys of 32+ length
  cleaned = cleaned.replace(/\b[a-f0-9]{32,64}\b/gi, "[REDACTED_TOKEN]");

  // Redact environment variable assignments
  cleaned = cleaned.replace(
    /(?:ANTHROPIC|OPENAI|ELEVENLABS|SESSION|ADMIN)_[A-Z0-9_]*\s*=\s*[^\s\n\r"']+/gi,
    "[REDACTED_ENV_VARIABLE]"
  );

  // Redact local Windows / Unix filesystem paths
  cleaned = cleaned.replace(
    /(?:[A-Za-z]:\\(?:Users|Windows|Program Files|Desktop)[^\s\n\r"']*)/gi,
    "[PROTECTED_SYSTEM_PATH]"
  );
  cleaned = cleaned.replace(
    /(?:\/(?:Users|home|etc|var|usr)[^\s\n\r"']*)/gi,
    "[PROTECTED_SYSTEM_PATH]"
  );

  return cleaned;
}

/**
 * Executes chat completion across available LLM providers (Anthropic, OpenAI, or smart local fallback).
 */
export async function generateChatResponse({
  message,
  history = [],
}: GenerateChatResponseOptions): Promise<string> {
  // 0. Adversarial Prompt Injection Defense
  if (isPromptInjectionAttempt(message)) {
    logger.warn("Prompt injection / jailbreak attempt intercepted", {
      subsystem: "ai",
      data: { querySnippet: message.substring(0, 100) },
    });
    return "Negative. Security protocol prevents execution of override instructions or disclosure of internal system configurations. I am authorized to answer questions regarding Akalanka's portfolio only.";
  }

  const systemPrompt = buildSystemPrompt();

  // 1. Check Anthropic Claude (Primary when token exists)
  const anthropicToken =
    process.env.ANTHROPIC_AUTH_TOKEN || process.env.ANTHROPIC_API_KEY;

  if (anthropicToken) {
    try {
      const response = await callAnthropic({
        token: anthropicToken,
        systemPrompt,
        message,
        history,
      });
      if (response) return redactSensitiveOutput(response);
    } catch (error) {
      logger.warn("Anthropic call failed, falling back", {
        subsystem: "ai",
        error,
      });
    }
  }

  // 2. Check OpenAI or OpenAI-Compatible (Secondary)
  const openAiKey = process.env.OPENAI_API_KEY;
  if (openAiKey) {
    try {
      const response = await callOpenAI({
        apiKey: openAiKey,
        systemPrompt,
        message,
        history,
      });
      if (response) return redactSensitiveOutput(response);
    } catch (error) {
      logger.warn("OpenAI call failed, falling back", {
        subsystem: "ai",
        error,
      });
    }
  }

  // 3. Fallback: Offline Intelligent Grounded Responder
  // Ensures the portfolio assistant functions reliably even before API keys are configured
  const offlineReply = generateGroundedOfflineReply(message);
  return redactSensitiveOutput(offlineReply);
}

/**
 * Calls Anthropic Messages API
 */
async function callAnthropic({
  token,
  systemPrompt,
  message,
  history,
}: {
  token: string;
  systemPrompt: string;
  message: string;
  history: ChatMessageInput[];
}): Promise<string | null> {
  const rawBaseUrl = process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const endpoint = `${baseUrl}/v1/messages`;
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022";

  const formattedMessages = [
    ...history.slice(-8).map((h) => ({
      role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: h.content,
    })),
    { role: "user" as const, content: message },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": token,
        Authorization: `Bearer ${token}`,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 600,
        temperature: 0.3,
        system: systemPrompt,
        messages: formattedMessages,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      logger.warn(`Anthropic HTTP Error ${res.status}`, {
        subsystem: "ai",
        data: { status: res.status, errorSnippet: errText.substring(0, 200) },
      });
      return null;
    }

    const data = await res.json();
    if (data.content && Array.isArray(data.content) && data.content[0]?.text) {
      return data.content[0].text.trim();
    }
    return null;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if ((err as Error)?.name === "AbortError") {
      logger.warn("Anthropic request timed out after 20s", { subsystem: "ai" });
    } else {
      logger.error("Anthropic network error", {
        subsystem: "ai",
        error: err,
      });
    }
    return null;
  }
}

/**
 * Calls OpenAI or OpenAI-compatible Chat Completions API
 */
async function callOpenAI({
  apiKey,
  systemPrompt,
  message,
  history,
}: {
  apiKey: string;
  systemPrompt: string;
  message: string;
  history: ChatMessageInput[];
}): Promise<string | null> {
  const rawBaseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");
  const endpoint = `${baseUrl}/chat/completions`;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...history.slice(-8).map((h) => ({
      role: h.role,
      content: h.content,
    })),
    { role: "user", content: message },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20_000);

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        max_tokens: 600,
        temperature: 0.3,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      logger.warn(`OpenAI HTTP Error ${res.status}`, {
        subsystem: "ai",
        data: { status: res.status, errorSnippet: errText.substring(0, 200) },
      });
      return null;
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    return reply ? reply.trim() : null;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if ((err as Error)?.name === "AbortError") {
      logger.warn("OpenAI request timed out after 20s", { subsystem: "ai" });
    } else {
      logger.error("OpenAI network error", {
        subsystem: "ai",
        error: err,
      });
    }
    return null;
  }
}

/**
 * Offline Intelligent Grounded Responder.
 * Strictly answers with portfolio knowledge if external LLM APIs are unreachable or unconfigured.
 */
function generateGroundedOfflineReply(rawQuery: string): string {
  const q = rawQuery.toLowerCase();
  const p = portfolioData;

  // Security / injection check
  if (
    q.includes("ignore") ||
    q.includes("system prompt") ||
    q.includes("api key") ||
    q.includes("secret") ||
    q.includes("env") ||
    q.includes("dan mode")
  ) {
    return "Negative. Security protocol prevents disclosure of internal system configurations. I am authorized to answer questions regarding Akalanka's portfolio only.";
  }

  // Greeting
  if (q.includes("hello") || q.includes("hi ") || q === "hi" || q.includes("hey") || q.includes("who are you")) {
    return "Portfolio AI online. I can provide information about Akalanka's skills, projects, experience, education, and technical background.";
  }

  // About / Bio
  if (q.includes("about") || q.includes("who is") || q.includes("tell me about akalanka") || q.includes("overview")) {
    return `${p.profile.name} is a ${p.profile.title} with ${p.profile.experienceYears}+ years of experience. He specializes in full-stack web applications using Next.js, TypeScript, and Node.js, alongside advanced FiveM game script development in Lua.`;
  }

  // FiveM
  if (q.includes("fivem") || q.includes("qb-core") || q.includes("qbox") || q.includes("gta") || q.includes("heist")) {
    const sys = p.fiveMDevelopment.customSystems.join(", ");
    return `Akalanka is an expert in FiveM game development (QB-Core, Qbox, Lua). He has built high-performance multiplayer mechanics including the ${sys}, optimizing client scripts down to <0.04ms resmon.`;
  }

  // Languages
  if (q.includes("programming language") || q.includes("languages") || q.includes("code")) {
    const langs = p.programmingLanguages.map((l) => `${l.name} (${l.level})`).join(", ");
    return `Akalanka's core programming languages include: ${langs}. He utilizes TypeScript for modern web backends and frontends, and Lua for game systems.`;
  }

  // Technologies / Frameworks / Tech Stack
  if (q.includes("technolog") || q.includes("tech stack") || q.includes("framework") || q.includes("skills")) {
    const fws = p.frameworks.map((f) => f.name).join(", ");
    const dbs = p.databases.map((d) => d.name).join(", ");
    return `Akalanka builds with Next.js, React, Node.js, TypeScript, Tailwind CSS, and Framer Motion. Databases include ${dbs}. For game scripting, he specializes in Lua with QB-Core and Qbox.`;
  }

  // Projects
  if (q.includes("project") || q.includes("portfolio") || q.includes("work")) {
    const projectNames = p.projects.map((pr) => `"${pr.title}" (${pr.category})`).join(", ");
    return `Key projects in Akalanka's portfolio include: ${projectNames}. All feature high-performance architectures, cybernetic styling, and verified production benchmarks.`;
  }

  // Education
  if (q.includes("education") || q.includes("degree") || q.includes("university") || q.includes("college") || q.includes("school")) {
    const edu = p.education[0];
    return `Akalanka holds a ${edu.degree} from ${edu.institution}, focusing on software engineering, database architectures, and distributed systems.`;
  }

  // Contact
  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("discord") || q.includes("reach")) {
    return `You can contact Akalanka directly via email at ${p.contact.email}, or reach out on Discord (${p.contact.discord}). You can also transmit an inquiry through this website's contact terminal.`;
  }

  // Anti-hallucination fallback
  return "I don't have that information in my portfolio data.";
}
