import { NextResponse } from "next/server";
import { z } from "zod";
import { getClientIp } from "@/lib/security/rate-limit";
import { authService } from "@/services/auth.service";
import { validateOrigin, csrfErrorResponse } from "@/lib/security/csrf";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  passcode: z.string().min(1, "Clearance passkey is required.").max(256),
  mfaCode: z.string().regex(/^\d{6}$/, "MFA code must be 6 digits").optional().or(z.literal("")),
});

export async function POST(req: Request) {
  try {
    // 0. Validate Request Origin (CSRF defense)
    if (!validateOrigin(req)) {
      return csrfErrorResponse();
    }

    const ip = getClientIp(req);

    // 1. Parse and validate request body schema
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request payload format." },
        { status: 400, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    const parsed = loginSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues?.[0]?.message || "Invalid credentials format.";
      return NextResponse.json(
        { error: firstIssue },
        { status: 400, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    const { passcode, mfaCode } = parsed.data;

    // 2. Delegate authentication check to AuthService
    const result = await authService.processLogin(ip, passcode, mfaCode || undefined);

    if (!result.success) {
      // Step-Up Multi-Factor Challenge
      if (result.requiresMfa && !result.error?.includes("Invalid or expired")) {
        return NextResponse.json(
          {
            requiresMfa: true,
            message: "MFA_REQUIRED: Please enter your 6-digit authenticator code.",
          },
          {
            status: 200,
            headers: { "Cache-Control": "no-store, private" },
          }
        );
      }

      if (result.isLocked) {
        return NextResponse.json(
          {
            error: result.error,
            remainingAttempts: 0,
            remainingSeconds: result.remainingSeconds,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(result.remainingSeconds || 900),
              "Cache-Control": "no-store, private",
            },
          }
        );
      }

      return NextResponse.json(
        {
          error: result.error,
          remainingAttempts: result.remainingAttempts,
          requiresMfa: result.requiresMfa,
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store, private" },
        }
      );
    }

    // 3. Authentication successful: return session cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "CLEARANCE GRANTED: Terminal access authorized.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, private",
        },
      }
    );

    if (result.cookieHeader) {
      response.headers.append("Set-Cookie", result.cookieHeader);
    }

    return response;
  } catch (error) {
    logger.error("Unexpected error during admin login", {
      subsystem: "auth",
      error,
    });
    return NextResponse.json(
      { error: "Internal authentication subsystem failure." },
      { status: 500, headers: { "Cache-Control": "no-store, private" } }
    );
  }
}
