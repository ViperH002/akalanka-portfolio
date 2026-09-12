import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Validates request origin and referer against the server host to prevent CSRF
 * and unauthorized cross-origin state-changing mutations.
 */
export function validateOrigin(req: Request): boolean {
  // Safe HTTP read methods are exempt from CSRF checks
  const safeMethods = ["GET", "HEAD", "OPTIONS"];
  if (safeMethods.includes(req.method.toUpperCase())) {
    return true;
  }

  const origin = req.headers.get("origin");
  const referer = req.headers.get("referer");
  const host = req.headers.get("host") || req.headers.get("x-forwarded-host");

  // If no host header is provided, reject
  if (!host) {
    return false;
  }

  const normalizedHost = host.toLowerCase().trim();

  // If origin is provided, verify it matches the current host
  if (origin) {
    try {
      const originUrl = new URL(origin);
      const originHost = originUrl.host.toLowerCase().trim();
      if (originHost === normalizedHost) {
        return true;
      }
      // Allow localhost / 127.0.0.1 development variations
      if (
        (originHost.startsWith("localhost:") || originHost === "localhost") &&
        (normalizedHost.startsWith("127.0.0.1:") || normalizedHost === "127.0.0.1" || normalizedHost.startsWith("localhost"))
      ) {
        return true;
      }
      if (
        (originHost.startsWith("127.0.0.1:") || originHost === "127.0.0.1") &&
        (normalizedHost.startsWith("localhost:") || normalizedHost === "localhost" || normalizedHost.startsWith("127.0.0.1"))
      ) {
        return true;
      }

      logger.warn("CSRF defense rejected request due to origin mismatch", {
        subsystem: "security",
        data: { originHost, normalizedHost },
      });
      return false;
    } catch {
      return false;
    }
  }

  // If referer is provided without origin, verify referer host matches
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const refererHost = refererUrl.host.toLowerCase().trim();
      return refererHost === normalizedHost;
    } catch {
      return false;
    }
  }

  // If neither Origin nor Referer is present (e.g. automated test runners, curl, or same-origin direct calls)
  return true;
}

export function csrfErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: "Forbidden: Cross-Site Request Verification Failed." },
    {
      status: 403,
      headers: {
        "Cache-Control": "no-store, private",
      },
    }
  );
}
