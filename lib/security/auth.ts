import crypto from "crypto";
import {
  getCryptographicSessionSecret,
  getAdministrativePasskey,
} from "@/lib/security/env";

export const ADMIN_COOKIE_NAME = "devcraft_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60; // 8 hours

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
 * Constant-time comparison to prevent timing attacks
 */
export function verifyAdminPassword(candidate: string): boolean {
  if (typeof candidate !== "string" || candidate.length === 0) {
    return false;
  }

  const expectedKey = getAdminSecretKey();

  // Hash both candidate and expected passkey with SHA-256 before timingSafeEqual
  // This guarantees identical byte length and eliminates timing leakage from string length variations
  const candidateHash = crypto.createHash("sha256").update(candidate).digest();
  const expectedHash = crypto.createHash("sha256").update(expectedKey).digest();

  return crypto.timingSafeEqual(candidateHash, expectedHash);
}

interface AdminSessionPayload {
  role: "admin";
  iat: number;
  exp: number;
}

/**
 * Generates an HMAC-SHA256 signed tamper-proof session token
 */
export function createAdminSessionToken(): string {
  const now = Date.now();
  const payload: AdminSessionPayload = {
    role: "admin",
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
 * Verifies HMAC-SHA256 signature and expiration of session token
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

    if (payload.role !== "admin") {
      return false;
    }

    if (Date.now() > payload.exp) {
      return false; // Expired session
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
