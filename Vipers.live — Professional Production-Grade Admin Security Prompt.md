# Vipers.live — Professional Production-Grade Admin Panel Security

## ROLE

Act as a:

- Senior Full-Stack Architect
- Next.js Security Engineer
- Application Security Engineer
- Auth.js Specialist
- Backend/API Security Engineer
- PostgreSQL Security Engineer
- DevSecOps Engineer
- OWASP Security Specialist
- Production Infrastructure Engineer

You are working on my existing production-oriented Vipers.live portfolio/application.

Technology may include:

- Next.js
- React
- TypeScript
- PostgreSQL
- Prisma/ORM
- Auth.js
- Server Actions
- Route Handlers/API
- Nginx/reverse proxy
- AWS/EC2
- Cloudflare/CDN where applicable

The production website is:

https://www.vipers.live

The current admin area is:

https://www.vipers.live/admin

---

# PRIMARY OBJECTIVE

Transform the existing admin panel into a **professional production-grade administrative system** using defense-in-depth security.

The admin panel must be protected through:

1. HTTPS
2. Reverse proxy
3. Authentication
4. Secure sessions
5. Server-side authorization
6. ADMIN role/permissions
7. MFA readiness/implementation
8. Rate limiting
9. API protection
10. Server Action protection
11. Input validation
12. Database authorization
13. Security headers
14. Audit logging
15. Secure secret management
16. Error protection
17. Monitoring/security logging

Do NOT rely on:

- Secret URLs
- Secret ports
- Hidden admin routes
- Frontend-only authorization
- Obscurity

The security boundary must exist on the server.

---

# CRITICAL RULE — DO NOT REBUILD THE WEBSITE

This is an existing application.

DO NOT:

- Rebuild the portfolio
- Redesign the public website
- Change the existing UI unnecessarily
- Change existing UX unnecessarily
- Remove existing features
- Change routes unnecessarily
- Replace the existing database unnecessarily
- Replace the existing ORM unnecessarily
- Replace existing infrastructure unnecessarily
- Introduce microservices unnecessarily
- Introduce Redis unnecessarily
- Introduce GraphQL unnecessarily

Preserve all existing functionality.

Only modify existing architecture where required for security, reliability, maintainability, or production readiness.

---

# PHASE 1 — SECURITY AUDIT FIRST

Before changing code, inspect the entire project.

Determine:

- Next.js version
- React version
- App Router vs Pages Router
- TypeScript configuration
- Authentication implementation
- Auth.js version if installed
- Current session strategy
- Current database
- ORM
- Admin routes
- API routes
- Server Actions
- Middleware/proxy
- Environment variables
- Security headers
- Rate limiting
- Password hashing
- User roles
- Admin permissions
- Database access
- File uploads
- External APIs
- Third-party services
- Deployment architecture
- Nginx configuration
- Docker configuration if present
- AWS configuration if present
- Cloudflare configuration if present

Search the entire repository for:

- passwords
- API keys
- tokens
- secrets
- private keys
- database credentials
- hardcoded admin credentials
- unsafe authorization logic
- `NEXT_PUBLIC_` secrets
- localStorage authentication
- sessionStorage authentication
- client-only admin checks

DO NOT expose discovered secret values in your report.

---

# PHASE 2 — CREATE SECURITY ARCHITECTURE

Design the final architecture approximately as:

```text
                    INTERNET
                       │
                       ▼
                 HTTPS / TLS
                       │
                       ▼
              CDN / WAF (optional)
                       │
                       ▼
                 NGINX / Proxy
                       │
              ┌────────┴────────┐
              │                 │
           PUBLIC             ADMIN
              │                 │
      www.vipers.live     admin.vipers.live
              │                 │
              └────────┬────────┘
                       ▼
                  Next.js
                       │
                Authentication
                       │
                Authorization
                       │
              ADMIN permission
                       │
                      MFA
                       │
                Server Actions
                  / API Routes
                       │
                Input Validation
                       │
                Business Logic
                       │
                  PostgreSQL
                       │
                 Audit Logging
```

Do not create unnecessary infrastructure.

Use the simplest architecture that provides strong security.

---

# PHASE 3 — ADMIN DOMAIN

Evaluate using:

`https://admin.vipers.live`

for the administrative interface.

This is preferred over relying on:

`https://www.vipers.live:9876/admin`

or another "secret port".

IMPORTANT:

A separate domain/subdomain is NOT considered authentication.

It must still use:

- HTTPS
- Authentication
- Authorization
- MFA
- Rate limiting
- API protection

If using an admin subdomain, configure:

- DNS
- TLS
- Reverse proxy
- Cookie policy
- CORS
- CSRF protections
- Security headers

correctly.

Do not implement the subdomain if it creates unnecessary complexity or breaks the current architecture.

Explain the decision.

---

# PHASE 4 — NETWORK SECURITY

If deployed on AWS/EC2:

Prefer:

```text
Internet
   │
   ▼
80 / 443
   │
   ▼
Nginx
   │
   ▼
127.0.0.1:3000
```

Do NOT expose the internal Next.js port publicly.

Example:

```text
80      PUBLIC
443     PUBLIC

3000    PRIVATE
3001    PRIVATE
5432    PRIVATE
```

If an internal admin service/port is used, bind it to localhost/private networking where possible.

Do NOT treat an internal port as the only security mechanism.

---

# PHASE 5 — AUTHENTICATION

Use Auth.js where appropriate.

If Auth.js already exists:

- Audit it.
- Harden it.
- Preserve the existing authentication architecture where possible.

Do not create a second authentication system.

Requirements:

- Secure login
- Secure session management
- Secure cookies
- HttpOnly
- Secure
- Appropriate SameSite policy
- Strong AUTH_SECRET
- Session expiration
- Secure logout
- Session invalidation where appropriate
- Password hashing
- Account status checks
- Generic login failure messages

Never store authentication tokens in:

- localStorage
- sessionStorage
- URLs

Never expose secrets to the client.

---

# PHASE 6 — PASSWORD SECURITY

If the application uses credentials authentication:

Use a modern password hashing algorithm appropriate for production, preferably Argon2id where compatible with the architecture.

Never store:

```text
plaintext password
```

Never log:

- passwords
- password hashes
- reset tokens
- session tokens
- MFA secrets

Implement appropriate password policies.

Do not create unnecessarily restrictive password rules that harm usability without improving security.

---

# PHASE 7 — ADMIN AUTHORIZATION

Implement explicit role-based authorization.

At minimum:

```text
USER
ADMIN
```

The database/server must be the source of truth.

Never trust:

- React state
- localStorage
- sessionStorage
- hidden buttons
- query parameters
- request body role
- client-side role values
- custom client headers

Create a centralized authorization mechanism such as:

```text
requireAdmin()
```

or an equivalent service.

Every sensitive operation must perform server-side authorization.

---

# PHASE 8 — PERMISSION ARCHITECTURE

Do not design the system around one giant "admin = everything" assumption if the application is likely to grow.

Prepare the architecture for permissions such as:

```text
ADMIN
EDITOR
MODERATOR
SUPPORT
USER
```

For the current application, only implement roles that are actually needed.

Do not add unnecessary complexity.

Use a centralized permission model so future permissions can be added safely.

---

# PHASE 9 — ADMIN ROUTE PROTECTION

Protect:

```text
/admin
/admin/*
```

Unauthenticated:

```text
→ /admin/login
```

Authenticated but unauthorized:

```text
→ 403
```

or an appropriate secure response.

Use Next.js middleware/proxy for early request protection where appropriate.

BUT:

Do not treat middleware/proxy as the final security boundary.

Server-side authorization must still exist inside:

- Server Actions
- Route Handlers
- API endpoints
- Database/service layer

---

# PHASE 10 — API SECURITY

Audit every API endpoint.

Classify endpoints:

```text
PUBLIC
AUTHENTICATED
ADMIN_ONLY
```

Every ADMIN_ONLY endpoint must verify:

```text
Authentication
        ↓
Authorization
        ↓
Input validation
        ↓
Business rules
        ↓
Database operation
        ↓
Audit logging
```

Do not assume that protecting `/admin` protects `/api/admin`.

An attacker must not be able to bypass the UI and call the API directly.

Test direct API access.

---

# PHASE 11 — SERVER ACTION SECURITY

Audit every Server Action.

Sensitive Server Actions must independently perform:

```text
Authentication
        ↓
Authorization
        ↓
Validation
        ↓
Business logic
        ↓
Database
```

Never rely on the page/component that calls the Server Action.

A malicious user must not be able to directly invoke a Server Action and bypass the admin UI.

---

# PHASE 12 — DATABASE SECURITY

Database access must remain server-side.

Never expose:

- DATABASE_URL
- database credentials
- private database endpoints

to the browser.

Never use:

```text
NEXT_PUBLIC_DATABASE_URL
```

Use the existing ORM if possible.

If Prisma is already installed:

- Preserve Prisma.
- Audit Prisma queries.
- Add indexes where appropriate.
- Validate IDs.
- Prevent unauthorized mutations.
- Prevent mass assignment.

Every destructive operation must have authorization.

---

# PHASE 13 — INPUT VALIDATION

Use Zod if already available.

Validate all:

- JSON bodies
- query parameters
- route parameters
- IDs
- slugs
- strings
- numbers
- enums
- URLs
- uploads

Never trust client-side validation.

Example conceptual flow:

```text
Request
  ↓
Authentication
  ↓
Authorization
  ↓
Schema validation
  ↓
Business validation
  ↓
Database
```

Protect against:

- XSS
- injection
- malformed data
- oversized input
- invalid IDs
- path traversal
- unsafe URLs

---

# PHASE 14 — RATE LIMITING

Implement rate limiting for sensitive operations.

At minimum:

```text
/admin/login
/authentication
/password reset
/MFA verification
/admin APIs
```

Use a distributed/shared mechanism if the deployment uses multiple instances.

Do not rely on a simple in-memory Map for a horizontally scaled production system.

Implement reasonable limits without causing unnecessary false positives.

---

# PHASE 15 — MFA

Implement or prepare production-grade MFA for privileged accounts.

Preferred:

```text
Password
   ↓
MFA/TOTP
   ↓
Admin session
```

Use an authenticator application compatible with TOTP.

Protect MFA secrets.

Never log MFA secrets.

Implement secure recovery procedures.

Do not create insecure MFA bypasses.

If MFA cannot be implemented immediately because of current architecture:

- document the limitation
- design the integration
- mark it as a remaining production security requirement

---

# PHASE 16 — SESSION SECURITY

Sessions must be:

- Secure
- HttpOnly
- Properly scoped
- Expiring
- Invalidatable
- Protected against fixation
- Protected against theft where practical

Review:

- cookie domain
- cookie path
- SameSite
- Secure
- HttpOnly
- session expiration
- session rotation/invalidation

Do not expose session tokens to JavaScript unnecessarily.

---

# PHASE 17 — CSRF

Audit all state-changing operations.

Determine CSRF requirements based on the actual:

- Auth.js version
- session strategy
- cookie behavior
- Server Actions
- API design

Do not blindly add conflicting CSRF systems.

Ensure cross-site requests cannot perform unauthorized state-changing operations.

---

# PHASE 18 — SECURITY HEADERS

Implement appropriate production security headers.

Evaluate:

```text
Strict-Transport-Security
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
frame-ancestors
```

Build CSP based on the actual application.

Do not blindly copy a CSP that breaks:

- Next.js
- fonts
- images
- animations
- analytics
- chatbot
- third-party services

Use the minimum required external sources.

---

# PHASE 19 — ADMIN UI SECURITY

The UI is NOT the security boundary.

However:

- Hide unauthorized controls.
- Do not expose secrets.
- Do not render private data unnecessarily.
- Use secure error states.
- Avoid dangerous operations without confirmation.
- Clearly distinguish destructive operations.
- Do not trust client state for authorization.

Client-side checks improve UX.

Server-side checks provide security.

---

# PHASE 20 — AUDIT LOGGING

Create an audit log system for security-sensitive events.

Examples:

```text
ADMIN_LOGIN_SUCCESS
ADMIN_LOGIN_FAILED
ADMIN_LOGOUT
ADMIN_MFA_SUCCESS
ADMIN_MFA_FAILED
PROJECT_CREATED
PROJECT_UPDATED
PROJECT_DELETED
MESSAGE_DELETED
SETTINGS_CHANGED
PASSWORD_CHANGED
ROLE_CHANGED
```

Store appropriate:

- userId
- action
- resource
- resourceId
- timestamp
- IP
- user agent
- safe metadata

Never store:

- password
- access token
- refresh token
- API key
- MFA secret
- private credential

---

# PHASE 21 — ERROR SECURITY

Production responses must NOT expose:

- stack traces
- SQL errors
- filesystem paths
- environment variables
- credentials
- internal service details
- authentication internals

Use generic client-facing messages.

Log detailed diagnostic information server-side.

---

# PHASE 22 — FILE UPLOAD SECURITY

If the admin panel supports uploads:

Implement:

- file size limits
- MIME validation
- extension validation
- filename sanitization
- storage isolation
- safe object names
- access control

Do not trust the uploaded filename or Content-Type.

Do not allow executable uploads.

---

# PHASE 23 — SECURITY MONITORING

Prepare logging/monitoring for:

- repeated login failures
- suspicious admin activity
- repeated 403 responses
- abnormal API usage
- account lockouts
- MFA failures
- destructive operations

Do not log sensitive credentials.

If the infrastructure supports alerts, document recommended alert thresholds.

---

# PHASE 24 — DEPLOYMENT SECURITY

For production:

```text
Internet
   ↓
HTTPS
   ↓
Reverse Proxy
   ↓
Next.js
   ↓
Private Database
```

Database should NOT be publicly exposed.

Admin application should NOT require a publicly exposed application port.

Use:

- firewall/security groups
- private database networking
- HTTPS
- secure environment variables
- least privilege
- automatic dependency updates where appropriate

---

# PHASE 25 — SECURITY TESTING

Perform real security tests.

## Test 1 — Unauthenticated

Attempt:

```text
/admin
/admin/projects
/api/admin/*
```

Expected:

DENIED

---

## Test 2 — Normal USER

Login as normal USER.

Attempt:

```text
/admin
/admin/projects
POST /api/admin/*
DELETE /api/admin/*
```

Expected:

DENIED

---

## Test 3 — ADMIN

Login as ADMIN.

Verify:

- Dashboard
- CRUD operations
- API access
- Server Actions
- Logout
- Session expiration
- MFA

Expected:

AUTHORIZED

---

## Test 4 — API bypass

Do not use the admin UI.

Call the API directly.

Expected:

Unauthorized requests are rejected.

---

## Test 5 — Manipulated role

Attempt to modify:

```text
role=ADMIN
```

in:

- request body
- query parameter
- localStorage
- sessionStorage
- client state
- headers

Expected:

No privilege escalation.

---

## Test 6 — Injection

Test appropriate payloads for:

- SQL injection
- XSS
- path traversal
- malformed JSON
- oversized requests

Expected:

Safe rejection.

---

## Test 7 — Brute force

Test repeated authentication attempts.

Expected:

Rate limiting / throttling.

---

## Test 8 — Session

Test:

- expired session
- invalid session
- logout
- session reuse
- cookie attributes

Expected:

Secure behavior.

---

# PHASE 26 — PRODUCTION SECURITY CHECKLIST

Create:

`docs/security/admin-production-checklist.md`

Include:

### Authentication

- [ ] Auth.js correctly configured
- [ ] Password hashing secure
- [ ] Secure session cookies
- [ ] Session expiration
- [ ] Secure logout
- [ ] MFA enabled for ADMIN

### Authorization

- [ ] ADMIN role server-side
- [ ] API authorization
- [ ] Server Action authorization
- [ ] Database authorization
- [ ] No client-only authorization

### Network

- [ ] HTTPS enabled
- [ ] HTTP redirects to HTTPS
- [ ] Internal ports private
- [ ] Database private
- [ ] Firewall configured
- [ ] Reverse proxy configured

### Application

- [ ] Input validation
- [ ] Rate limiting
- [ ] Security headers
- [ ] Safe error handling
- [ ] Audit logging

### Secrets

- [ ] No secrets in Git
- [ ] No secrets in NEXT_PUBLIC_*
- [ ] Production secrets configured
- [ ] Database credentials protected

### Testing

- [ ] Unauthorized access tested
- [ ] User privilege escalation tested
- [ ] API bypass tested
- [ ] Brute force tested
- [ ] Session security tested
- [ ] Input validation tested

---

# PHASE 27 — DOCUMENTATION

Create:

`docs/security/admin-security-architecture.md`

Document:

1. Authentication architecture
2. Authorization architecture
3. Admin route protection
4. API protection
5. Server Action protection
6. Database security
7. MFA
8. Session security
9. Rate limiting
10. Audit logging
11. Security headers
12. Network architecture
13. Deployment architecture
14. Environment variables
15. Security testing
16. Incident response recommendations

Include architecture diagrams using Mermaid where useful.

---

# IMPLEMENTATION RULES

Before modifying code:

1. Audit first.
2. Understand the current architecture.
3. Identify the smallest safe change.
4. Preserve existing functionality.
5. Implement incrementally.
6. Run tests after every major security change.
7. Run TypeScript checks.
8. Run linting.
9. Run production build.
10. Test authentication.
11. Test authorization.
12. Test APIs.
13. Test Server Actions.

Do not make speculative architectural changes.

Do not add dependencies unless they provide a clear security or architectural benefit.

---

# FINAL SECURITY VERDICT

Do NOT declare:

"Production Ready"

until all critical security requirements have been tested.

Return one of:

🟢 PRODUCTION READY

🟡 CONDITIONALLY PRODUCTION READY

🔴 NOT PRODUCTION READY

The final report must contain:

1. Security architecture
2. Files changed
3. Files created
4. Dependencies added
5. Database changes
6. Environment variables required
7. Infrastructure changes
8. Security vulnerabilities fixed
9. Security tests performed
10. Remaining risks
11. Deployment requirements
12. Final security verdict

If a critical issue remains, explicitly mark:

`NOT PRODUCTION READY`

Do not hide unresolved vulnerabilities.

---

# MOST IMPORTANT SECURITY PRINCIPLE

The admin panel must remain secure even if an attacker knows:

- the admin URL
- the admin domain
- the API endpoints
- the route structure
- the application framework
- the frontend source code

Security must come from:

```text
Authentication
      ↓
Authorization
      ↓
Validation
      ↓
Business Logic
      ↓
Database Access Control
```

NOT from:

```text
Secret URL
Secret Port
Hidden Button
Obscure Route
Frontend Security
```

Build Vipers.live's admin panel according to this principle.