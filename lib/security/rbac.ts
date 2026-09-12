import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/security/auth";
import { logger } from "@/lib/logger";

export type Role = "admin" | "editor" | "user";

export type Permission =
  | "READ_LEADS"
  | "DELETE_LEADS"
  | "UPDATE_SETTINGS"
  | "VIEW_AUDIT"
  | "MANAGE_USERS"
  | "SYSTEM_TELEMETRY";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "READ_LEADS",
    "DELETE_LEADS",
    "UPDATE_SETTINGS",
    "VIEW_AUDIT",
    "MANAGE_USERS",
    "SYSTEM_TELEMETRY",
  ],
  editor: [
    "READ_LEADS",
    "UPDATE_SETTINGS",
    "SYSTEM_TELEMETRY",
  ],
  user: [],
};

export interface SessionContext {
  authenticated: boolean;
  userId: string;
  role: Role;
  jti?: string;
}

/**
 * Checks if a role is granted a specific permission
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

/**
 * Extracts and cryptographically verifies session token from incoming request cookies
 */
export function extractSessionContext(request: NextRequest): SessionContext {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME);
  const token = cookie?.value;

  if (!token || !verifyAdminSessionToken(token)) {
    return {
      authenticated: false,
      userId: "anonymous",
      role: "user",
    };
  }

  try {
    const parts = token.split(".");
    const payload = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    return {
      authenticated: true,
      userId: payload.userId || "admin_primary",
      role: (payload.role as Role) || "admin",
      jti: payload.jti,
    };
  } catch {
    return {
      authenticated: false,
      userId: "anonymous",
      role: "user",
    };
  }
}

/**
 * Centralized server-side enforcement guard: requires active verified ADMIN role.
 * Returns null if authorized, or a pre-configured NextResponse (401 / 403) to return immediately.
 */
export function requireAdmin(request: NextRequest): { session: SessionContext } | { response: NextResponse } {
  const session = extractSessionContext(request);

  if (!session.authenticated) {
    logger.warn("Unauthorized API access attempt to protected admin endpoint", {
      subsystem: "rbac",
      data: { path: request.nextUrl.pathname },
    });
    return {
      response: NextResponse.json(
        { error: "AUTHENTICATION_REQUIRED", message: "Session expired or invalid. Please authenticate." },
        { status: 401, headers: { "Cache-Control": "no-store, private" } }
      ),
    };
  }

  if (session.role !== "admin") {
    logger.warn("Forbidden privilege escalation attempt", {
      subsystem: "rbac",
      data: { path: request.nextUrl.pathname, role: session.role },
    });
    return {
      response: NextResponse.json(
        { error: "ACCESS_DENIED", message: "Insufficient permissions to perform this operation." },
        { status: 403, headers: { "Cache-Control": "no-store, private" } }
      ),
    };
  }

  return { session };
}

/**
 * Centralized server-side permission guard
 */
export function requirePermission(request: NextRequest, permission: Permission): { session: SessionContext } | { response: NextResponse } {
  const session = extractSessionContext(request);

  if (!session.authenticated) {
    return {
      response: NextResponse.json(
        { error: "AUTHENTICATION_REQUIRED", message: "Session expired or invalid." },
        { status: 401, headers: { "Cache-Control": "no-store, private" } }
      ),
    };
  }

  if (!hasPermission(session.role, permission)) {
    return {
      response: NextResponse.json(
        { error: "FORBIDDEN", message: `Permission '${permission}' is required.` },
        { status: 403, headers: { "Cache-Control": "no-store, private" } }
      ),
    };
  }

  return { session };
}
