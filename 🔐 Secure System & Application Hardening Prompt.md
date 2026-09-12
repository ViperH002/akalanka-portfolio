# 🔐 Secure System & Application Hardening Prompt

You are a **senior software engineer, application security engineer, and QA engineer**.

Your task is to **audit, identify, fix, and verify security, authentication, session, caching, data-handling, and reliability issues** in the entire application.

Do NOT make superficial changes. Inspect the existing architecture, frontend, backend, APIs, authentication flow, database access, middleware, sessions, cookies, caching, environment variables, and error handling before making changes.

The application must follow **secure-by-default principles**.

---

## 1. NEVER Store User Data in Server Global Memory

### Requirement

Do NOT store user-specific, authentication-related, session-related, or sensitive data in:

- Global variables
- Module-level variables
- Singleton objects
- In-memory arrays
- In-memory objects
- Static variables
- Process-level caches
- Temporary server memory intended to persist between requests

### Examples of prohibited patterns

```js
let currentUser = {};
let loggedInUsers = [];
global.sessions = {};
const userData = {};
```

Do not use these patterns for user/session state.

### Why

Server processes can be:

- Restarted
- Scaled horizontally
- Replicated
- Shared by multiple users
- Reused between requests

Global memory can therefore cause:

- Cross-user data leakage
- Session confusion
- Authentication bypass
- Race conditions
- Data loss
- Security vulnerabilities

### Correct approach

Use appropriate persistent or dedicated storage:

- Database
- Secure server-side session store
- Redis or another dedicated session/cache store where appropriate
- Existing application authentication provider

User-specific state must be isolated between users.

---

# 2. Login Confirmation & Authentication Verification

Implement a secure login confirmation process.

After login:

1. Validate credentials server-side.
2. Verify the authentication result server-side.
3. Create/establish the authenticated session securely.
4. Never trust authentication information supplied only by the frontend.
5. Verify the authenticated user on every protected server request.
6. Ensure the session belongs to the correct user.
7. Reject invalid, expired, revoked, or manipulated sessions.

### Never rely on:

```js
localStorage.isLoggedIn === "true"
```

or:

```js
if (userLoggedIn) {
   // allow access
}
```

Authentication must be enforced on the server/API layer.

### Login security requirements

Implement where appropriate:

- Secure password hashing
- Password verification
- Session creation
- Session expiration
- Logout/session invalidation
- Account lockout or progressive delays where appropriate
- Rate limiting
- Brute-force protection
- Secure cookies
- `HttpOnly`
- `Secure`
- Appropriate `SameSite`
- Session rotation after authentication
- Protection against session fixation

---

# 3. Force Stop Screen Cache / Sensitive Page Caching

Sensitive authenticated pages must not remain accessible through browser cache after logout.

Implement appropriate cache-control headers for authenticated/sensitive responses.

For sensitive pages/API responses, use headers such as:

```http
Cache-Control: no-store, no-cache, must-revalidate, private
Pragma: no-cache
Expires: 0
```

Do NOT blindly disable caching for the entire application.

Only disable caching where sensitive information is involved.

### Logout behavior

When the user logs out:

1. Invalidate the server-side session.
2. Clear authentication cookies.
3. Clear sensitive client-side authentication state.
4. Prevent authenticated API requests using the old session.
5. Prevent browser back-button access to sensitive pages.
6. Ensure sensitive pages cannot be restored from browser cache.
7. Redirect the user to the login page.
8. Verify that the old session/token no longer works.

---

# 4. Session Security

Audit the complete session lifecycle.

Check:

- Session creation
- Session storage
- Session expiration
- Session renewal
- Session invalidation
- Logout
- Multiple-device sessions
- Session fixation
- Session hijacking
- Token theft
- Cookie security
- Refresh token handling

Never expose session tokens in:

- URLs
- Logs
- Error messages
- HTML
- Client-visible debugging output

---

# 5. Authentication & Authorization

Separate authentication from authorization.

Authentication answers:

> "Who is the user?"

Authorization answers:

> "Is this user allowed to perform this action?"

Every protected API endpoint must verify authorization server-side.

Prevent:

- IDOR
- Privilege escalation
- Horizontal privilege escalation
- Vertical privilege escalation
- Access to another user's resources

Never trust:

```js
req.body.userId
```

or:

```js
req.query.userId
```

as proof that the requester owns that account/resource.

Always derive the authenticated user from the verified session/token.

---

# 6. Client-Side Authentication Security

Do NOT treat frontend state as the source of truth.

Frontend variables such as:

```js
isAdmin
isLoggedIn
userRole
userId
```

must never be trusted for security decisions.

The server must independently verify:

- Identity
- Role
- Permissions
- Resource ownership

---

# 7. API Security

Audit every API endpoint.

For each endpoint verify:

- Authentication
- Authorization
- Input validation
- Output handling
- Rate limiting
- Error handling
- HTTP method validation
- Content-Type validation
- Request size limits
- Ownership checks

Remove or secure:

- Debug endpoints
- Test endpoints
- Development endpoints
- Unauthenticated administrative endpoints
- Unused API routes

---

# 8. Input Validation & Injection Protection

Protect against:

- SQL Injection
- NoSQL Injection
- Command Injection
- XSS
- HTML Injection
- LDAP Injection
- Template Injection
- Path Traversal
- SSRF

Use:

- Parameterized queries
- ORM/query builders correctly
- Strict input validation
- Output encoding
- Allow-lists where appropriate

Never construct SQL queries using raw user input.

---

# 9. XSS Protection

Audit all locations where user-controlled data is rendered.

Check:

- Stored XSS
- Reflected XSS
- DOM XSS

Do not inject untrusted data directly into HTML.

Be especially careful with:

```js
innerHTML
dangerouslySetInnerHTML
eval()
```

Use safe rendering mechanisms wherever possible.

Implement an appropriate Content Security Policy (CSP).

---

# 10. CSRF Protection

For cookie-based authentication, protect state-changing requests against CSRF.

Audit:

- POST
- PUT
- PATCH
- DELETE

Use appropriate:

- CSRF tokens
- SameSite cookies
- Origin/Referer validation where appropriate

Do not rely on frontend JavaScript alone.

---

# 11. Secrets & API Keys

Never expose:

- Database passwords
- API keys
- Private keys
- JWT secrets
- Encryption keys
- Service credentials

in:

- Frontend source code
- Public repositories
- HTML
- Browser local storage
- Client JavaScript bundles

Use environment variables or a proper secrets-management system.

If a secret has already been exposed, treat it as compromised and recommend rotation.

---

# 12. Rate Limiting

Implement rate limiting for sensitive endpoints, especially:

- Login
- Registration
- Password reset
- OTP verification
- Email verification
- API endpoints
- Administrative operations

Use stricter limits for authentication-related endpoints.

Return appropriate HTTP status codes without revealing sensitive information.

---

# 13. Secure Error Handling

Never expose:

- Stack traces
- Database errors
- SQL queries
- File paths
- Environment variables
- Internal service information
- Authentication secrets

to normal users.

Use safe production error responses.

Detailed errors should only be available through controlled server-side logging.

---

# 14. Security Headers

Review and implement appropriate security headers, including where applicable:

```http
Content-Security-Policy
Strict-Transport-Security
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Do not add headers blindly. Ensure they are compatible with the application's legitimate functionality.

---

# 15. HTTPS & Cookie Security

Ensure production authentication uses HTTPS.

Authentication cookies should use appropriate:

```text
HttpOnly
Secure
SameSite
```

Cookie scope should be as restrictive as practical.

Do not place authentication tokens in URLs.

---

# 16. Database Security

Audit database access.

Ensure:

- Parameterized queries
- Least-privilege database accounts
- No exposed database credentials
- Proper connection handling
- Safe migrations
- Sensitive fields are protected
- Users cannot access another user's records

---

# 17. Logging & Monitoring

Create security-conscious logs.

Log important security events such as:

- Failed login attempts
- Successful authentication
- Logout
- Password changes
- Permission changes
- Administrative actions
- Suspicious access attempts

NEVER log:

- Passwords
- Session tokens
- Refresh tokens
- API keys
- Private keys
- Sensitive personal data unnecessarily

---

# 18. Environment & Production Configuration

Audit production configuration.

Check for:

- Debug mode enabled
- Development credentials
- Default passwords
- Exposed `.env`
- Directory listing
- Verbose errors
- Unnecessary ports/services
- CORS misconfiguration
- Unsafe production defaults

Use secure production configuration.

---

# 19. CORS Security

Do not use:

```http
Access-Control-Allow-Origin: *
```

for authenticated applications unless it is genuinely required and safe.

Allow only trusted origins where appropriate.

Never dynamically reflect arbitrary origins without validation.

---

# 20. File Upload Security

If the application supports uploads, verify:

- File type validation
- File size limits
- Filename sanitization
- Storage isolation
- Executable file prevention
- MIME-type validation
- Malware scanning where appropriate
- Authorization before accessing uploaded files

Do not trust the extension supplied by the client.

---

# 21. Security Dependency Audit

Review dependencies for:

- Known vulnerabilities
- Outdated packages
- Unnecessary packages
- Abandoned packages

Do not upgrade dependencies blindly if it could break the application.

Prefer safe, supported versions.

---

# 22. Frontend Storage Audit

Review:

- localStorage
- sessionStorage
- IndexedDB
- Cookies
- Service Workers
- Browser caches

Do not store sensitive authentication secrets in browser storage unless there is a strong, explicitly justified security design.

Remove sensitive data when it is no longer required.

---

# 23. IDOR / Resource Ownership

For every resource identified by:

```text
/user/:id
/order/:id
/profile/:id
/document/:id
/file/:id
```

verify that the authenticated user has permission to access that specific resource.

Never assume that knowing an ID means the user is authorized to access it.

---

# 24. Security Testing

After making changes, perform security-focused QA.

Test at minimum:

### Authentication

- Login with valid credentials
- Login with invalid credentials
- Repeated failed login attempts
- Logout
- Access protected pages after logout
- Reuse an old session
- Expired session
- Invalid session
- Session fixation scenarios

### Authorization

- User accessing another user's data
- Normal user accessing admin routes
- Modified resource IDs
- Modified API parameters

### Cache

- Logout
- Press browser Back
- Refresh protected page
- Open protected URL directly
- Attempt old API requests after logout

### Injection

- SQL injection testing
- XSS testing
- Malicious input testing
- Path traversal testing

### API

- Unauthenticated requests
- Unauthorized requests
- Invalid methods
- Invalid content types
- Oversized requests
- Rate-limit testing

---

# 25. Security Regression Testing

Do not only fix the vulnerability.

Verify that:

1. The vulnerability is actually fixed.
2. Existing legitimate functionality still works.
3. Authentication still works.
4. Authorization still works.
5. Logout still works.
6. API requests still work correctly.
7. Performance has not been unnecessarily degraded.
8. No new security vulnerability was introduced.

---

# 26. Code Quality Requirements

When modifying code:

- Follow the existing architecture where reasonable.
- Do not introduce unnecessary dependencies.
- Do not duplicate authentication logic unnecessarily.
- Keep security logic centralized.
- Use reusable middleware/helpers.
- Keep secrets outside source code.
- Add comments only where they clarify non-obvious security decisions.
- Do not remove security controls just to make tests pass.

---

# 27. Security Priority

Classify findings as:

### 🔴 CRITICAL
Immediate exploitation possible, authentication bypass, remote code execution, major data exposure, or complete authorization bypass.

### 🟠 HIGH
Serious security vulnerability that can expose accounts, sensitive information, or privileged functionality.

### 🟡 MEDIUM
Security weakness requiring specific conditions or limited impact.

### 🟢 LOW
Hardening issue or defense-in-depth improvement.

---

# 28. Final Security Audit Report

After completing the audit and fixes, provide:

## Security Summary

- Total vulnerabilities found
- Critical
- High
- Medium
- Low
- Fixed
- Remaining

## Authentication Status

- Login security
- Session security
- Logout security
- Cache protection
- Authorization

## API Security

- Protected endpoints
- Authorization checks
- Rate limiting
- Input validation

## Data Security

- Server memory usage
- Database security
- Browser storage
- Secrets

## QA Results

Show:

| Test | Result | Notes |
|---|---|---|
| Login | PASS/FAIL | |
| Logout | PASS/FAIL | |
| Session invalidation | PASS/FAIL | |
| Back-button cache | PASS/FAIL | |
| Authorization | PASS/FAIL | |
| IDOR | PASS/FAIL | |
| XSS | PASS/FAIL | |
| SQL Injection | PASS/FAIL | |
| CSRF | PASS/FAIL | |
| Rate limiting | PASS/FAIL | |
| API security | PASS/FAIL | |

## Final Verdict

Return exactly one:

**🟢 READY FOR PRODUCTION**

or

**🟠 CONDITIONALLY READY**

or

**🔴 NOT SAFE FOR PRODUCTION**

If any Critical or High severity vulnerability remains unresolved, the application must NOT be marked **READY FOR PRODUCTION**.

---

## IMPORTANT RULES

1. Do not trust client-side security controls.
2. Do not store user/session data in server global memory.
3. Do not expose secrets.
4. Do not weaken security to fix functionality.
5. Do not disable security middleware without justification.
6. Do not claim a vulnerability is fixed without testing it.
7. Do not assume authentication means authorization.
8. Do not assume hiding a UI element provides security.
9. Protect sensitive pages from browser caching.
10. Invalidate sessions properly during logout.
11. Verify authorization on every protected resource.
12. Prefer secure defaults.
13. Preserve existing functionality while improving security.
14. Test both positive and negative security scenarios.
15. Treat all user input as untrusted.
16. Treat all client-provided identity/role information as untrusted.
17. Never expose sensitive information through logs or error messages.

**Your goal is not merely to make the application work. Your goal is to make it secure, testable, maintainable, and production-ready.**