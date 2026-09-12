import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/security/rate-limit";
import { authService } from "@/services/auth.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    // 1. Parse request body safely
    let body: { passcode?: string };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request payload format." },
        { status: 400, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    const { passcode } = body;

    if (!passcode || typeof passcode !== "string") {
      return NextResponse.json(
        { error: "Clearance passkey is required." },
        { status: 400, headers: { "Cache-Control": "no-store, private" } }
      );
    }

    // 2. Delegate authentication check to AuthService
    const result = await authService.processLogin(ip, passcode);

    if (!result.success) {
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
