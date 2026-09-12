import { VoiceConfig } from "@/types/ai";
import { logger } from "@/lib/logger";

/**
 * ElevenLabs Text-to-Speech Service
 * Configured for an authoritative, deep cybernetic commander voice.
 */

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  // Configurable via env; default deep authoritative voice ID
  voiceId: process.env.ELEVENLABS_VOICE_ID || "pNInz6obpgDQGcFmaJgB",
  modelId: process.env.ELEVENLABS_MODEL_ID || "eleven_turbo_v2_5",
  stability: parseFloat(process.env.ELEVENLABS_STABILITY || "0.72"),
  similarity: parseFloat(process.env.ELEVENLABS_SIMILARITY || "0.85"),
  style: parseFloat(process.env.ELEVENLABS_STYLE || "0.35"),
  speed: 0.95, // deliberate, commanded pacing
  speakerBoost: process.env.ELEVENLABS_SPEAKER_BOOST !== "false",
};

// In-memory audio cache to save API credits and accelerate repeated playback (capped at 50 entries)
const audioCache = new Map<string, Buffer>();

/**
 * Sanitizes markdown, symbols, URLs, and code blocks to ensure clean spoken speech.
 */
export function sanitizeTextForSpeech(raw: string): string {
  let text = raw;

  // Remove code blocks and inline code
  text = text.replace(/```[\s\S]*?```/g, "");
  text = text.replace(/`([^`]+)`/g, "$1");

  // Remove markdown URLs [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove markdown headers, bold, italics, bullets
  text = text.replace(/^#+\s+/gm, "");
  text = text.replace(/[*_~]+/g, "");
  text = text.replace(/^[-*+]\s+/gm, "");

  // Remove URLs
  text = text.replace(/https?:\/\/\S+/g, "");

  // Collapse excess whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Cap speech length to preserve API limits and listener attention
  if (text.length > 800) {
    text = text.substring(0, 800) + "...";
  }

  return text;
}

/**
 * Generates audio buffer from ElevenLabs or returns cached audio.
 */
export async function generateSpeechAudio(textToSpeak: string): Promise<Buffer | null> {
  const cleanText = sanitizeTextForSpeech(textToSpeak);
  if (!cleanText) return null;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    logger.warn("ELEVENLABS_API_KEY not configured. Audio synthesis bypassed.", {
      subsystem: "tts",
    });
    return null;
  }

  const voiceId = encodeURIComponent(DEFAULT_VOICE_CONFIG.voiceId.trim());
  const cacheKey = `${voiceId}_${cleanText}`;

  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?optimize_streaming_latency=3`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: cleanText,
        model_id: DEFAULT_VOICE_CONFIG.modelId,
        voice_settings: {
          stability: DEFAULT_VOICE_CONFIG.stability,
          similarity_boost: DEFAULT_VOICE_CONFIG.similarity,
          style: DEFAULT_VOICE_CONFIG.style,
          use_speaker_boost: DEFAULT_VOICE_CONFIG.speakerBoost,
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      logger.warn(`ElevenLabs API HTTP ${response.status}`, {
        subsystem: "tts",
        data: { status: response.status, error: errorText },
      });
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Cache generated audio (limit cache size to 50 items)
    if (audioCache.size > 50) {
      const firstKey = audioCache.keys().next().value;
      if (firstKey) audioCache.delete(firstKey);
    }
    audioCache.set(cacheKey, buffer);

    return buffer;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    if ((err as Error)?.name === "AbortError") {
      logger.warn("ElevenLabs request timed out after 20s", { subsystem: "tts" });
    } else {
      logger.error("ElevenLabs audio generation error", {
        subsystem: "tts",
        error: err,
      });
    }
    return null;
  }
}
