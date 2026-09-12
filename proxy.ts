import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};

const ADMIN_COOKIE_NAME = "devcraft_admin_session";

/**
 * Next.js 16 Edge Proxy Guard (supersedes legacy middleware convention).
 * Intercepts incoming requests to privileged admin areas and enforces early perimeter boundaries.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow public authentication challenge endpoints
  if (
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/session" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // 2. Extract session cookie
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME);
  const token = sessionCookie?.value;

  // 3. Early validation: check token structure
  const isValidFormat = Boolean(token && token.includes(".") && token.split(".").length === 2);

  // 4. Handle API routes
  if (pathname.startsWith("/api/admin")) {
    if (!isValidFormat) {
      return NextResponse.json(
        {
          error: "AUTHENTICATION_REQUIRED",
          message: "Valid administrative session clearance is required to access this interface.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, private",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    }
  }

  // 5. Handle Admin page subroutes (/admin/...)
  if (pathname.startsWith("/admin/") && pathname !== "/admin") {
    if (!isValidFormat) {
      const loginUrl = new URL("/admin", request.url);
      loginUrl.searchParams.set("auth", "required");
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next();

  // Enforce strict zero-cache security on all administrative responses
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, private");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");

  return response;
}

// Backwards-compatibility export
export const middleware = proxy;
