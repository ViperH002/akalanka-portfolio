import { logger } from "@/lib/logger";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminPassword,
  createAdminSessionToken,
  verifyAdminSessionToken,
  revokeSessionToken,
  getAdminSessionCookieOptions,
  getAdminSessionClearCookieOptions,
} from "@/lib/security/auth";
import {
  checkLoginLockout,
  recordLoginFailure,
  clearLoginFailures,
} from "@/lib/security/rate-limit";
import { auditStore } from "@/lib/storage/audit-store";

export interface LoginAttemptResult {
  success: boolean;
  isLocked?: boolean;
  remainingSeconds?: number;
  remainingAttempts?: number;
  error?: string;
  cookieHeader?: string;
}

export class AuthService {
  /**
   * Validates admin passkey with constant-time verification, tracks lockout state,
   * and issues an HMAC-SHA256 authenticated cookie header on success.
   */
  async processLogin(ip: string, passcode: string): Promise<LoginAttemptResult> {
    // 1. Check brute-force lockout status
    const lockout = checkLoginLockout(ip);
    if (lockout.isLocked) {
      await auditStore.recordEvent({
        action: "lockout_triggered",
        ip,
        details: { remainingSeconds: lockout.remainingLockoutSeconds },
      });
      logger.warn("Blocked login attempt from locked IP", {
        subsystem: "auth",
        data: { ip, remainingSeconds: lockout.remainingLockoutSeconds },
      });
      return {
        success: false,
        isLocked: true,
        remainingSeconds: lockout.remainingLockoutSeconds,
        error: `Terminal locked due to excessive failed attempts. Please retry after ${lockout.remainingLockoutSeconds} seconds.`,
      };
    }

    // 2. Verify passkey using constant-time comparison
    const isValid = verifyAdminPassword(passcode.trim());

    if (!isValid) {
      const failureResult = recordLoginFailure(ip);
      await auditStore.recordEvent({
        action: failureResult.isLocked ? "lockout_triggered" : "login_failed",
        ip,
        details: { remainingAttempts: failureResult.remainingAttempts },
      });
      logger.warn("Invalid admin clearance passkey attempt", {
        subsystem: "auth",
        data: { ip, remainingAttempts: failureResult.remainingAttempts },
      });

      if (failureResult.isLocked) {
        return {
          success: false,
          isLocked: true,
          remainingSeconds: failureResult.remainingLockoutSeconds,
          remainingAttempts: 0,
          error: "ACCESS DENIED. Terminal locked for 15 minutes due to 5 consecutive failures.",
        };
      }

      return {
        success: false,
        isLocked: false,
        remainingAttempts: failureResult.remainingAttempts,
        error: "ACCESS DENIED: Invalid Security Clearance Passkey.",
      };
    }

    // 3. Clear failure counter on success
    clearLoginFailures(ip);

    // 4. Record successful audit event
    await auditStore.recordEvent({
      action: "login_success",
      ip,
    });

    // 5. Issue tamper-proof HMAC-SHA256 session token
    const token = createAdminSessionToken();
    const isProduction = process.env.NODE_ENV === "production";
    const cookieHeader = getAdminSessionCookieOptions(token, isProduction);

    logger.info("Admin clearance granted", {
      subsystem: "auth",
      data: { ip },
    });

    return {
      success: true,
      cookieHeader,
    };
  }

  /**
   * Invalidates session token server-side, logs security event, and generates removal cookie
   */
  async processLogout(token?: string | null, ip: string = "127.0.0.1"): Promise<{ cookieHeader: string }> {
    if (token) {
      revokeSessionToken(token);
    }

    await auditStore.recordEvent({
      action: "logout",
      ip,
    });

    const isProduction = process.env.NODE_ENV === "production";
    const cookieHeader = getAdminSessionClearCookieOptions(isProduction);

    logger.info("Admin clearance revoked and session invalidated", { subsystem: "auth" });
    return { cookieHeader };
  }

  /**
   * Verifies existing session token
   */
  verifySession(token: string | undefined | null): boolean {
    return verifyAdminSessionToken(token);
  }

  getCookieName(): string {
    return ADMIN_COOKIE_NAME;
  }
}

export const authService = new AuthService();
