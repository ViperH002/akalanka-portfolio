import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/services/auth.service";
import { getClientIp } from "@/lib/security/rate-limit";
import { validateOrigin, csrfErrorResponse } from "@/lib/security/csrf";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // 0. Validate Request Origin (CSRF defense)
    if (!validateOrigin(req)) {
      return csrfErrorResponse();
    }

    const ip = getClientIp(req);
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(authService.getCookieName());
    const token = sessionCookie?.value;

    const { cookieHeader } = await authService.processLogout(token, ip);

    const response = NextResponse.json(
      {
        success: true,
        message: "CLEARANCE REVOKED: Terminal session permanently invalidated.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );

    response.headers.append("Set-Cookie", cookieHeader);
    return response;
  } catch (error) {
    logger.error("Error during admin logout in /api/admin/logout", {
      subsystem: "auth",
      error,
    });
    return NextResponse.json(
      { error: "Failed to cleanly revoke session." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }
}
