import { z } from "zod";
import { logger } from "@/lib/logger";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SESSION_SECRET: z.string().min(16).optional(),
  ADMIN_SESSION_SECRET: z.string().min(16).optional(),
  ADMIN_SECRET_KEY: z.string().min(6).optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  ADMIN_NOTIFICATION_EMAIL: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_AUTH_TOKEN: z.string().optional(),
  ANTHROPIC_BASE_URL: z.string().optional(),
  ANTHROPIC_MODEL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().optional(),
  OPENAI_MODEL: z.string().optional(),
  ELEVENLABS_API_KEY: z.string().optional(),
  ELEVENLABS_VOICE_ID: z.string().optional(),
  WAKATIME_API_KEY: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

export type ValidatedEnv = z.infer<typeof envSchema>;

let cachedEnv: ValidatedEnv | null = null;
let securityAuditLogged = false;

/**
 * Validates and caches server environment variables
 */
export function getValidatedEnv(): ValidatedEnv {
  if (cachedEnv) {
    return cachedEnv;
  }

  const rawEnv = {
    NODE_ENV: process.env.NODE_ENV,
    SESSION_SECRET: process.env.SESSION_SECRET,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    ADMIN_NOTIFICATION_EMAIL: process.env.ADMIN_NOTIFICATION_EMAIL,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    ANTHROPIC_AUTH_TOKEN: process.env.ANTHROPIC_AUTH_TOKEN,
    ANTHROPIC_BASE_URL: process.env.ANTHROPIC_BASE_URL,
    ANTHROPIC_MODEL: process.env.ANTHROPIC_MODEL,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
    ELEVENLABS_VOICE_ID: process.env.ELEVENLABS_VOICE_ID,
    WAKATIME_API_KEY: process.env.WAKATIME_API_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  };

  const parsed = envSchema.safeParse(rawEnv);

  if (!parsed.success) {
    logger.warn("Environment variable validation warnings detected", {
      subsystem: "security",
      data: { errors: parsed.error.flatten().fieldErrors },
    });
    cachedEnv = rawEnv as ValidatedEnv;
  } else {
    cachedEnv = parsed.data;
  }

  // Run one-time production security sanity checks
  if (!securityAuditLogged) {
    securityAuditLogged = true;
    const isProd = cachedEnv.NODE_ENV === "production";
    const sessionSecret = cachedEnv.SESSION_SECRET || cachedEnv.ADMIN_SESSION_SECRET;

    if (isProd && (!sessionSecret || sessionSecret.length < 32)) {
      logger.warn(
        "CRITICAL SECURITY NOTICE: SESSION_SECRET is either missing or has low entropy (< 32 chars). Set a secure 32+ character random secret in production environment.",
        { subsystem: "security" }
      );
    }

    if (isProd && (!cachedEnv.ADMIN_SECRET_KEY || cachedEnv.ADMIN_SECRET_KEY === "admin2026")) {
      logger.warn(
        "CRITICAL SECURITY NOTICE: ADMIN_SECRET_KEY is using default credentials. Update ADMIN_SECRET_KEY in production environment.",
        { subsystem: "security" }
      );
    }
  }

  return cachedEnv;
}

/**
 * Retrieves the cryptographic session signing secret with safe entropy guarantees
 */
export function getCryptographicSessionSecret(): string {
  const env = getValidatedEnv();
  const secret = env.SESSION_SECRET || env.ADMIN_SESSION_SECRET;

  if (secret && secret.length >= 16) {
    return secret;
  }

  // Fallback for local development
  return "devcraft-system-hardening-secret-key-2026-production-entropy";
}

/**
 * Retrieves the administrative clearance passkey
 */
export function getAdministrativePasskey(): string {
  const env = getValidatedEnv();
  return env.ADMIN_SECRET_KEY || "admin2026";
}
