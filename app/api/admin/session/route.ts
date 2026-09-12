import { NextRequest, NextResponse } from "next/server";
import { extractSessionContext, hasPermission, Role } from "@/lib/security/rbac";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = extractSessionContext(request);

    if (!session.authenticated) {
      return NextResponse.json(
        {
          authenticated: false,
          role: "user",
          permissions: [],
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
    }

    const mfaConfigured = Boolean(process.env.ADMIN_MFA_SECRET && process.env.ADMIN_MFA_SECRET.trim().length > 0);

    return NextResponse.json(
      {
        authenticated: true,
        userId: session.userId,
        role: session.role,
        permissions: session.role === "admin" ? ["ALL"] : [],
        mfaEnabled: mfaConfigured,
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
  } catch (error) {
    logger.error("Error evaluating session context in /api/admin/session", {
      subsystem: "auth",
      error,
    });
    return NextResponse.json(
      { authenticated: false, role: "user", permissions: [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, private",
        },
      }
    );
  }
}
