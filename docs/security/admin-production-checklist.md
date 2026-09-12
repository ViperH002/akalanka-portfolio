# Vipers.live — Production Security Checklist

## 1. Authentication
- [x] **Secure Session Strategy:** Cryptographically signed HMAC-SHA256 tokens using isolated CSPRNG keys.
- [x] **Password Hashing:** Salted PBKDF2-HMAC-SHA512 (100,000 rounds) supported alongside constant-time SHA-256 passkeys.
- [x] **Secure Session Cookies:** `HttpOnly`, `Secure` (in production), `SameSite=Strict`, `Path=/`, 8-hour expiry.
- [x] **Session Expiration:** Hard 8-hour timeout enforced both in token payload and cookie Max-Age.
- [x] **Secure Logout:** Server-side persistent token revocation via high-entropy `jti` in `data/revocations.json`.
- [x] **MFA Enabled for ADMIN:** RFC 6238 TOTP Multi-Factor Authentication implemented with step-up verification.
- [x] **No Credential Leaks:** Passwords, tokens, and MFA secrets are strictly excluded from all application logs and responses.

---

## 2. Authorization
- [x] **Server-Side RBAC as Source of Truth:** Centralized `requireAdmin()` and `requirePermission()` guards in `lib/security/rbac.ts`.
- [x] **Role Isolation:** `admin`, `editor`, and `user` roles enforced server-side.
- [x] **API Authorization:** All `/api/admin/*` endpoints independently verify session validity and admin role.
- [x] **Zero Client Trust:** Client localStorage, React state, or body parameters cannot alter or escalate user roles.
- [x] **Zero Reliance on Obscurity:** Security boundaries enforced via cryptographic tokens, not hidden buttons or secret URLs.

---

## 3. Network & Edge Infrastructure
- [x] **HTTPS Enforcement:** Strict-Transport-Security (`max-age=63072000; includeSubDomains; preload`).
- [x] **HTTP to HTTPS Redirects:** Enforced automatically by Vercel Edge / TLS 1.3 terminating proxy.
- [x] **Internal Ports Private:** Next.js runtime is encapsulated behind Vercel serverless / reverse proxy.
- [x] **Private Storage:** File storage (`data/`) and audit records are isolated on the server and inaccessible via HTTP (404).
- [x] **IP Anti-Spoofing:** Authenticated edge proxy headers (`cf-connecting-ip`, `x-real-ip`) prioritized over client `X-Forwarded-For`.

---

## 4. Application Security & Defenses
- [x] **Input Validation:** Strict Zod schemas on all mutation routes (`/api/contact`, `/api/chat`, `/api/admin/login`).
- [x] **Rate Limiting:** Sliding-window token bucket on sensitive routes, with automated 15-minute brute-force lockout after 5 failures.
- [x] **Security Headers:**
  - `Content-Security-Policy`: Default `'self'`, frame-ancestors `'none'`, base-uri `'self'`, form-action `'self'`.
  - `X-Frame-Options`: `DENY`
  - `X-Content-Type-Options`: `nosniff`
  - `Referrer-Policy`: `strict-origin-when-cross-origin`
  - `Permissions-Policy`: `camera=(), microphone=(), geolocation=(), browsing-topics=()`
- [x] **CSRF Protection:** Strict Origin and Referer validation on all mutation POST requests.
- [x] **Safe Error Handling:** Production API responses never leak stack traces, database details, or filesystem paths.
- [x] **Audit Logging:** Structured append-only audit trail (`data/audit.log`) tracking logins, logouts, MFA, and lockouts with 10MB log rotation.

---

## 5. Secret Management
- [x] **No Secrets in Git:** `.env*` strictly ignored in `.gitignore`.
- [x] **No Secrets in `NEXT_PUBLIC_*`:** All cryptographic secrets are private server-only variables.
- [x] **Production Secret Fallback:** Ephemeral 256-bit CSPRNG secrets generated if production keys are missing, preventing hardcoded defaults.

---

## 6. Testing & Verification
- [x] **Unauthorized Access Tested:** Verified rejection of unauthenticated access to `/admin` and `/api/admin/*`.
- [x] **User Privilege Escalation Tested:** Attempted role manipulation payload rejected.
- [x] **API Bypass Tested:** Direct HTTP requests without session rejected with 401/403.
- [x] **Brute-Force Lockout Tested:** 5 failed login attempts trigger 15-minute IP lockout.
- [x] **Session Revocation Tested:** Revoked tokens permanently rejected across server restarts.
- [x] **Injection Defenses Tested:** SQL, XSS, and Path Traversal payloads safely blocked.
