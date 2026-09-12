import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authService } from "@/services/auth.service";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(authService.getCookieName());
    const token = sessionCookie?.value;

    const isAuthenticated = authService.verifySession(token);

    return NextResponse.json(
      { authenticated: isAuthenticated },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    logger.error("Error checking session status in /api/admin/session", {
      subsystem: "auth",
      error,
    });
    return NextResponse.json(
      { authenticated: false },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, private",
        },
      }
    );
  }
}
