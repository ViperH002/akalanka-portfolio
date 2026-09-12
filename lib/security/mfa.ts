import crypto from "crypto";

/**
 * Base32 character set (RFC 4648)
 */
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Decodes a Base32 string into a Buffer
 */
export function base32Decode(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/\s+/g, "");
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const char = clean.charAt(i);
    const index = BASE32_CHARS.indexOf(char);
    if (index === -1) continue;

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

/**
 * Encodes a Buffer into a Base32 string (RFC 4648)
 */
export function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }

  return output;
}

/**
 * Generates a high-entropy Base32 encoded TOTP secret (160 bits / 20 bytes)
 */
export function generateTOTPSecret(): string {
  const randomBytes = crypto.randomBytes(20);
  return base32Encode(randomBytes);
}

/**
 * Computes a 6-digit TOTP code for a given timestamp according to RFC 6238
 */
export function computeTOTP(secretBase32: string, timestampMs: number = Date.now(), timeStepSec: number = 30): string {
  const key = base32Decode(secretBase32);
  const timeCounter = Math.floor(timestampMs / 1000 / timeStepSec);

  // 8-byte big-endian counter buffer
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigInt64BE(BigInt(timeCounter), 0);

  // HMAC-SHA1 of counter
  const hmac = crypto.createHmac("sha1", key).update(counterBuffer).digest();

  // Dynamic truncation (RFC 4226)
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binaryCode =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = binaryCode % 1000000;
  return otp.toString().padStart(6, "0");
}

/**
 * Verifies a candidate TOTP token against a secret with ±1 time step tolerance (RFC 6238)
 */
export function verifyTOTPToken(secretBase32: string, candidateToken: string): boolean {
  if (!secretBase32 || !candidateToken) return false;
  const cleanToken = candidateToken.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(cleanToken)) return false;

  const now = Date.now();
  const timeStepMs = 30 * 1000;

  // Check current window, preceding window, and succeeding window (±30s clock drift)
  for (let offset = -1; offset <= 1; offset++) {
    const expected = computeTOTP(secretBase32, now + offset * timeStepMs, 30);
    const expectedBuf = Buffer.from(expected, "utf8");
    const candidateBuf = Buffer.from(cleanToken, "utf8");

    if (expectedBuf.length === candidateBuf.length && crypto.timingSafeEqual(expectedBuf, candidateBuf)) {
      return true;
    }
  }

  return false;
}

/**
 * Generates an otpauth:// URI for QR code generation in authenticator apps
 */
export function getTOTPAuthUrl(secretBase32: string, accountName: string = "admin@vipers.live", issuer: string = "Vipers.live"): string {
  const encodedIssuer = encodeURIComponent(issuer);
  const encodedAccount = encodeURIComponent(accountName);
  return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${secretBase32}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
}

/**
 * Generates a set of 8 cryptographically secure one-time recovery backup codes
 */
export function generateBackupCodes(count: number = 8): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4, 8)}`);
  }
  return codes;
}
