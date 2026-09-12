import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  getCryptographicSessionSecret,
  getAdministrativePasskey,
} from "@/lib/security/env";

export const ADMIN_COOKIE_NAME = "devcraft_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60; // 8 hours

const REVOCATIONS_FILE = path.join(process.cwd(), "data", "revocations.json");

/**
 * Gets server signing secret from validated environment
 */
function getSessionSecret(): string {
  return getCryptographicSessionSecret();
}

/**
 * Gets the configured administrative clearance passkey
 */
function getAdminSecretKey(): string {
  return getAdministrativePasskey();
}

/**
 * Cryptographic PBKDF2-HMAC-SHA512 password hashing with random 16-byte salt (100,000 rounds)
 */
export function hashPassword(password: string, customSalt?: string): { hash: string; salt: string } {
  const salt = customSalt || crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512");
  return {
    hash: derivedKey.toString("hex"),
    salt,
  };
}

/**
 * Constant-time comparison to prevent timing attacks.
 * Supports both salted PBKDF2 hashes and SHA-256 digested passkeys.
 */
export function verifyAdminPassword(candidate: string): boolean {
  if (typeof candidate !== "string" || candidate.length === 0) {
    return false;
  }

  // 1. If PBKDF2 salted hash is configured in environment
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredSalt = process.env.ADMIN_PASSWORD_SALT;
  if (configuredHash && configuredSalt) {
    const candidateDerived = crypto.pbkdf2Sync(candidate, configuredSalt, 100000, 64, "sha512");
    const expectedBuf = Buffer.from(configuredHash, "hex");
    if (candidateDerived.length === expectedBuf.length && crypto.timingSafeEqual(candidateDerived, expectedBuf)) {
      return true;
    }
  }

  // 2. Constant-time SHA-256 comparison against ADMIN_SECRET_KEY
  const expectedKey = getAdminSecretKey();
  const candidateHash = crypto.createHash("sha256").update(candidate).digest();
  const expectedHash = crypto.createHash("sha256").update(expectedKey).digest();

  return crypto.timingSafeEqual(candidateHash, expectedHash);
}

export interface AdminSessionPayload {
  jti: string;
  userId?: string;
  role: "admin" | "editor" | "user";
  iat: number;
  exp: number;
}

// Memory-bounded map of revoked session identifiers with expiry timestamp
const revokedSessions = new Map<string, number>();

/**
 * Initializes revoked session map from persistent disk on startup to survive restarts
 */
function loadRevocationsFromDisk(): void {
  try {
    if (fs.existsSync(REVOCATIONS_FILE)) {
      const data = fs.readFileSync(REVOCATIONS_FILE, "utf-8");
      const parsed = JSON.parse(data);
      const now = Date.now();
      if (typeof parsed === "object" && parsed !== null) {
        Object.entries(parsed).forEach(([jti, exp]) => {
          if (typeof exp === "number" && exp > now) {
            revokedSessions.set(jti, exp);
          }
        });
      }
    }
  } catch {
    // Non-blocking fallback
  }
}

// Run initial load
loadRevocationsFromDisk();

/**
 * Atomically writes current non-expired revocations to disk
 */
function persistRevocationsToDisk(): void {
  try {
    const dir = path.dirname(REVOCATIONS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const now = Date.now();
    const record: Record<string, number> = {};
    revokedSessions.forEach((exp, jti) => {
      if (exp > now) record[jti] = exp;
    });

    const tempPath = `${REVOCATIONS_FILE}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(record, null, 2), "utf-8");
    fs.renameSync(tempPath, REVOCATIONS_FILE);
  } catch {
    // Non-blocking fallback
  }
}

/**
 * Sweeps expired session IDs from revocation map to prevent unbounded growth
 */
function cleanupRevokedSessions(): void {
  const now = Date.now();
  let modified = false;
  revokedSessions.forEach((exp, jti) => {
    if (now > exp) {
      revokedSessions.delete(jti);
      modified = true;
    }
  });
  if (modified) {
    persistRevocationsToDisk();
  }
}

/**
 * Permanently invalidates a session token server-side upon logout
 * Writes to memory map, persists to disk, and pushes to Upstash Redis if configured
 */
export function revokeSessionToken(token: string | undefined | null): void {
  if (!token || typeof token !== "string") return;

  const parts = token.split(".");
  if (parts.length !== 2) return;

  try {
    const payloadJson = Buffer.from(parts[0], "base64url").toString("utf8");
    const payload: Partial<AdminSessionPayload> = JSON.parse(payloadJson);
    if (payload.jti && payload.exp) {
      revokedSessions.set(payload.jti, payload.exp);
      persistRevocationsToDisk();
      cleanupRevokedSessions();

      // Distributed Upstash Redis synchronization (if configured)
      const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
      const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
      if (redisUrl && redisToken) {
        const ttlSec = Math.max(1, Math.ceil((payload.exp - Date.now()) / 1000));
        const cleanUrl = redisUrl.replace(/\/+$/, "");
        fetch(`${cleanUrl}/set/revoked:${payload.jti}/1?ex=${ttlSec}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${redisToken}` },
        }).catch(() => {
          // Redis failure falls back gracefully to disk+memory revocation
        });
      }
    }
  } catch {
    // Ignore malformed token
  }
}

/**
 * Checks if a session identifier has been explicitly revoked
 */
export function isSessionRevoked(jti: string): boolean {
  return revokedSessions.has(jti);
}

/**
 * Generates an HMAC-SHA256 signed tamper-proof session token with unique cryptographic ID
 */
export function createAdminSessionToken(options?: { role?: "admin" | "editor" | "user"; userId?: string }): string {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    jti: crypto.randomUUID(),
    userId: options?.userId || "admin_primary",
    role: options?.role || "admin",
    iat: now,
    exp: now + SESSION_DURATION_SECONDS * 1000,
  };

  const payloadString = JSON.stringify(payload);
  const payloadBase64 = Buffer.from(payloadString, "utf8").toString("base64url");

  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(payloadBase64);
  const signature = hmac.digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies HMAC-SHA256 signature, expiration, and non-revocation status of session token
 */
export function verifyAdminSessionToken(token: string | undefined | null): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [payloadBase64, providedSignature] = parts;

  // Re-calculate expected HMAC
  const hmac = crypto.createHmac("sha256", getSessionSecret());
  hmac.update(payloadBase64);
  const expectedSignature = hmac.digest("base64url");

  // Constant-time signature comparison
  const providedBuffer = Buffer.from(providedSignature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");

  if (providedBuffer.length !== expectedBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return false;
  }

  // Parse and validate payload
  try {
    const payloadJson = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const payload: AdminSessionPayload = JSON.parse(payloadJson);

    if (payload.role !== "admin" && payload.role !== "editor") {
      return false;
    }

    if (Date.now() > payload.exp) {
      return false; // Expired session
    }

    // Reject explicitly revoked session tokens
    if (payload.jti && isSessionRevoked(payload.jti)) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Generates Set-Cookie header string with strict security flags
 */
export function getAdminSessionCookieOptions(token: string, isProduction: boolean): string {
  const maxAge = SESSION_DURATION_SECONDS;
  const secureFlag = isProduction ? "; Secure" : "";
  return `${ADMIN_COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${secureFlag}`;
}

/**
 * Generates deletion Set-Cookie header string
 */
export function getAdminSessionClearCookieOptions(isProduction: boolean): string {
  const secureFlag = isProduction ? "; Secure" : "";
  return `${ADMIN_COOKIE_NAME}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Strict${secureFlag}`;
}
