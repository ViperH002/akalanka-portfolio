import { NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { cookieHeader } = authService.processLogout();

    const response = NextResponse.json(
      {
        success: true,
        message: "CLEARANCE REVOKED: Terminal session terminated.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, private",
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
      { status: 500, headers: { "Cache-Control": "no-store, private" } }
    );
  }
}
