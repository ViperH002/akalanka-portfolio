/**
 * In-memory sliding window rate limiter and security tracking
 * Protects server-side API routes (/api/chat, /api/tts, /api/contact, /api/admin/login)
 * from abuse, denial of service, and brute-force password attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

interface LoginLockoutRecord {
  failures: number;
  lastFailureTime: number;
  lockedUntil: number;
}

const MAX_RATE_LIMIT_ENTRIES = 10_000;
const MAX_LOCKOUT_ENTRIES = 5_000;

const rateLimitCache = new Map<string, RateLimitRecord>();
const loginLockoutCache = new Map<string, LoginLockoutRecord>();

// Periodic cleanup of stale rate limit entries to prevent memory exhaustion
setInterval(() => {
  const now = Date.now();
  rateLimitCache.forEach((record: RateLimitRecord, key: string) => {
    record.timestamps = record.timestamps.filter((ts: number) => now - ts < 120_000);
    if (record.timestamps.length === 0) {
      rateLimitCache.delete(key);
    }
  });

  loginLockoutCache.forEach((record: LoginLockoutRecord, ip: string) => {
    // If lockout has expired and no failures in last 30 minutes, purge record
    if (now > record.lockedUntil && now - record.lastFailureTime > 1_800_000) {
      loginLockoutCache.delete(ip);
    }
  });
}, 60_000);

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Sliding window rate limit checker
 */
export function checkRateLimit(
  identifier: string,
  maxRequests: number = 20,
  windowMs: number = 60_000
): RateLimitResult {
  const now = Date.now();
  let record = rateLimitCache.get(identifier);

  if (!record) {
    if (rateLimitCache.size >= MAX_RATE_LIMIT_ENTRIES) {
      const oldestKey = rateLimitCache.keys().next().value;
      if (oldestKey) rateLimitCache.delete(oldestKey);
    }
    record = { timestamps: [] };
    rateLimitCache.set(identifier, record);
  }

  // Remove timestamps outside sliding window
  record.timestamps = record.timestamps.filter((ts: number) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetTime = Math.ceil((oldest + windowMs - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      resetTime: Math.max(resetTime, 1),
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetTime: Math.ceil(windowMs / 1000),
  };
}

/**
 * Validates and extracts client IP from standard proxy headers
 * Defends against malformed header injection and header tampering
 */
export function getClientIp(req: Request): string {
  // 1. Prioritize trusted edge proxy headers that cannot be injected behind authentic proxies
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  const realIp = req.headers.get("x-real-ip");
  const forwarded = req.headers.get("x-forwarded-for");

  let rawIp = "";

  if (cfConnectingIp) {
    rawIp = cfConnectingIp.trim();
  } else if (realIp) {
    rawIp = realIp.trim();
  } else if (forwarded) {
    // In multi-hop proxies, leftmost is client IP
    rawIp = forwarded.split(",")[0].trim();
  }

  if (!rawIp) {
    return "127.0.0.1";
  }

  // Remove IPv6 brackets if present e.g. [::1]:8080 -> ::1
  let cleanIp = rawIp.replace(/^\[|\]$/g, "");

  // Strip port number if present (IPv4: 127.0.0.1:8080 or IPv6: [::1]:8080)
  if (cleanIp.includes(":") && !cleanIp.includes("::")) {
    const parts = cleanIp.split(":");
    if (parts.length === 2 && /^\d+$/.test(parts[1])) {
      cleanIp = parts[0];
    }
  }

  // Validate IPv4 format
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
  // Validate IPv6 format
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){1,7}:?([0-9a-fA-F]{1,4})?$/;

  if (ipv4Regex.test(cleanIp) || ipv6Regex.test(cleanIp) || cleanIp === "::1") {
    return cleanIp;
  }

  // Safe fallback
  return "127.0.0.1";
}

/**
 * Dedicated Brute-Force Defense for Admin Authentication
 * Allows max 5 consecutive failed attempts per 15-minute window.
 * Exceeding 5 failures locks the IP out for 15 minutes.
 */
const MAX_LOGIN_FAILURES = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Derives brute-force lockout bucket identifier.
 * Buckets public IPv4 addresses into /24 subnets to defeat automated IP-rotation evasion.
 */
function getLockoutKey(ip: string): string {
  if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("10.0.") || ip.startsWith("10.99.")) {
    return ip;
  }
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
    }
  }
  return ip;
}

export function checkLoginLockout(ip: string): {
  isLocked: boolean;
  remainingLockoutSeconds: number;
  failures: number;
  remainingAttempts: number;
} {
  const now = Date.now();
  const key = getLockoutKey(ip);
  const record = loginLockoutCache.get(key) || loginLockoutCache.get(ip);

  if (!record) {
    return {
      isLocked: false,
      remainingLockoutSeconds: 0,
      failures: 0,
      remainingAttempts: MAX_LOGIN_FAILURES,
    };
  }

  // If currently locked out
  if (now < record.lockedUntil) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return {
      isLocked: true,
      remainingLockoutSeconds: remainingSeconds,
      failures: record.failures,
      remainingAttempts: 0,
    };
  }

  // If lockout or window has lapsed, reset failure count if last failure was > 15m ago
  if (now - record.lastFailureTime > LOCKOUT_WINDOW_MS) {
    loginLockoutCache.delete(ip);
    return {
      isLocked: false,
      remainingLockoutSeconds: 0,
      failures: 0,
      remainingAttempts: MAX_LOGIN_FAILURES,
    };
  }

  return {
    isLocked: false,
    remainingLockoutSeconds: 0,
    failures: record.failures,
    remainingAttempts: Math.max(0, MAX_LOGIN_FAILURES - record.failures),
  };
}

export function recordLoginFailure(ip: string): {
  isLocked: boolean;
  remainingAttempts: number;
  remainingLockoutSeconds: number;
} {
  const now = Date.now();
  const key = getLockoutKey(ip);
  let record = loginLockoutCache.get(key) || loginLockoutCache.get(ip);

  if (!record || now - record.lastFailureTime > LOCKOUT_WINDOW_MS) {
    record = {
      failures: 1,
      lastFailureTime: now,
      lockedUntil: 0,
    };
  } else {
    record.failures += 1;
    record.lastFailureTime = now;
  }

  if (record.failures >= MAX_LOGIN_FAILURES) {
    record.lockedUntil = now + LOCKOUT_WINDOW_MS;
    if (loginLockoutCache.size >= MAX_LOCKOUT_ENTRIES && !loginLockoutCache.has(key)) {
      const oldestKey = loginLockoutCache.keys().next().value;
      if (oldestKey) loginLockoutCache.delete(oldestKey);
    }
    loginLockoutCache.set(key, record);
    return {
      isLocked: true,
      remainingAttempts: 0,
      remainingLockoutSeconds: Math.ceil(LOCKOUT_WINDOW_MS / 1000),
    };
  }

  if (loginLockoutCache.size >= MAX_LOCKOUT_ENTRIES && !loginLockoutCache.has(key)) {
    const oldestKey = loginLockoutCache.keys().next().value;
    if (oldestKey) loginLockoutCache.delete(oldestKey);
  }
  loginLockoutCache.set(key, record);
  return {
    isLocked: false,
    remainingAttempts: MAX_LOGIN_FAILURES - record.failures,
    remainingLockoutSeconds: 0,
  };
}

export function clearLoginFailures(ip: string): void {
  const key = getLockoutKey(ip);
  loginLockoutCache.delete(ip);
  loginLockoutCache.delete(key);
}

/**
 * Distributed rate-limit adapter supporting Upstash Redis REST API
 * with instant, resilient fallback to the in-memory sliding window.
 */
export async function checkRateLimitAsync(
  identifier: string,
  maxRequests: number = 20,
  windowMs: number = 60_000
): Promise<RateLimitResult> {
  // Dynamically import to avoid circular dependency
  const { getValidatedEnv } = await import("./env");
  const { logger } = await import("@/lib/logger");
  const env = getValidatedEnv();

  if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600); // 600ms network timeout

    try {
      const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
      const key = `ratelimit:${identifier}`;
      const url = env.UPSTASH_REDIS_REST_URL.replace(/\/+$/, "");

      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", key],
          ["EXPIRE", key, windowSec],
        ]),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = (await res.json()) as Array<{ result: number }>;
        const count = data?.[0]?.result || 1;
        const allowed = count <= maxRequests;
        const remaining = Math.max(0, maxRequests - count);

        return {
          allowed,
          remaining,
          resetTime: windowSec,
        };
      }
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      logger.warn("Distributed Redis rate-limiting failed or timed out, falling back to local memory", {
        subsystem: "security",
        error: err,
      });
    }
  }

  // Seamless fallback to high-performance in-memory sliding window
  return checkRateLimit(identifier, maxRequests, windowMs);
}

/**
 * Returns current rate-limiter operational diagnostics
 */
export function getRateLimiterStatus(): {
  mode: "distributed_redis" | "in_memory";
  activeEntries: number;
  maxEntries: number;
} {
  const isDistributed =
    typeof process !== "undefined" &&
    !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

  return {
    mode: isDistributed ? "distributed_redis" : "in_memory",
    activeEntries: rateLimitCache.size,
    maxEntries: MAX_RATE_LIMIT_ENTRIES,
  };
}
