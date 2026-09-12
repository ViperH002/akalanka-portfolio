# 🔐 FULL APPLICATION SECURITY HARDENING & OWASP SECURITY AUDIT

You are a **senior application security engineer, penetration tester, and secure software developer**.

Your task is to perform a **complete security audit, penetration-test-style review, remediation, and security hardening** of this application.

The goal is to make the system **production-ready from a security perspective** while preserving all existing functionality, UI, API contracts, database behavior, and business logic wherever possible.

Do NOT blindly rewrite the application.

First understand the existing architecture, then identify vulnerabilities, fix them, and finally retest the system.

---

# 1. SECURITY AUDIT WORKFLOW

Follow this exact process:

### Phase 1 — Understand the application

Inspect:

- Frontend
- Backend
- API routes
- Authentication system
- Authorization system
- Database
- ORM/query layer
- File upload system
- Storage
- Sessions
- Cookies
- JWT implementation
- OAuth implementation
- Admin panel
- User roles
- Middleware
- Webhooks
- Background jobs
- External API integrations
- Email functionality
- Payment functionality
- Environment variables
- Configuration files
- Docker configuration
- CI/CD configuration
- Dependencies
- Logging
- Error handling
- WebSocket connections
- AI/LLM integrations
- Third-party services

Create an internal architecture map before making major changes.

---

# 2. SQL INJECTION

Test and secure every database interaction.

Check:

- Raw SQL queries
- Dynamic SQL
- Search parameters
- Filters
- Sorting
- Pagination
- Login queries
- Admin queries
- API parameters
- URL parameters
- Headers
- Cookies

Requirements:

- Use parameterized queries/prepared statements.
- Use ORM safely.
- Never concatenate user input into SQL.
- Validate and sanitize database query parameters.
- Apply allowlists for dynamic column/table names.
- Ensure database users have minimum required privileges.
- Do not expose database errors to users.

Test common injection locations after remediation.

---

# 3. CROSS-SITE SCRIPTING (XSS)

Audit for:

- Stored XSS
- Reflected XSS
- DOM-based XSS
- HTML injection
- JavaScript injection
- SVG-based XSS
- Markdown XSS
- Rich-text editor vulnerabilities
- User profile fields
- Comments
- Search fields
- Admin interfaces
- Error messages

Requirements:

- Proper output encoding.
- Context-aware escaping.
- Sanitize HTML where HTML is intentionally allowed.
- Avoid dangerous `innerHTML` usage.
- Avoid unsafe dynamic JavaScript execution.
- Sanitize Markdown/HTML.
- Implement Content Security Policy where practical.
- Use secure cookie settings.

Never rely only on client-side validation.

---

# 4. BROKEN ACCESS CONTROL

Audit every protected resource and operation.

Test:

- Admin endpoints
- User endpoints
- Staff endpoints
- Owner-only resources
- Update operations
- Delete operations
- Download endpoints
- Export endpoints
- API endpoints
- Internal tools

Requirements:

- Authorization must be enforced server-side.
- Never trust frontend role checks.
- Implement centralized authorization middleware/policies.
- Apply deny-by-default authorization.
- Verify permissions for every sensitive operation.

Test horizontal and vertical privilege escalation.

---

# 5. IDOR / INSECURE DIRECT OBJECT REFERENCES

Find endpoints such as:

`/users/{id}`

`/orders/{id}`

`/documents/{id}`

`/files/{id}`

`/invoices/{id}`

etc.

Test whether one authenticated user can access another user's resources by modifying IDs.

Requirements:

- Verify resource ownership server-side.
- Use authorization checks on every object.
- Never rely on obscurity of IDs.
- Consider UUIDs where appropriate, but do NOT treat UUIDs as an authorization mechanism.

---

# 6. CSRF

Audit all state-changing requests.

Protect:

- POST
- PUT
- PATCH
- DELETE
- Account changes
- Password changes
- Email changes
- Payment actions
- Admin actions

Requirements:

- Implement CSRF protection where cookie-based authentication is used.
- Configure SameSite cookies appropriately.
- Validate Origin/Referer where appropriate.
- Never rely exclusively on CORS as CSRF protection.

---

# 7. SSRF

Audit all server-side functionality that accepts URLs.

Examples:

- Image URL fetchers
- Webhooks
- URL previews
- Import functions
- PDF generators
- External API proxies
- Remote file downloads
- Metadata fetchers

Block access to:

- localhost
- 127.0.0.1
- private IP ranges
- link-local addresses
- cloud metadata endpoints
- internal DNS names
- internal network services

Requirements:

- Use URL allowlists where possible.
- Validate destination after DNS resolution.
- Protect against DNS rebinding.
- Restrict outbound network access.
- Do not trust user-provided URLs.

---

# 8. EXPOSED API KEYS / SECRETS

Search the entire repository for:

- API keys
- Access tokens
- Private keys
- JWT secrets
- Database credentials
- Cloud credentials
- OAuth secrets
- Encryption keys
- Service account credentials

Check:

- Source code
- `.env`
- `.env.local`
- Git history
- Build files
- Docker files
- Logs
- Frontend bundles
- Configuration files

Requirements:

- Move secrets to secure environment/secret management.
- Never expose server-side secrets to frontend code.
- Rotate compromised credentials.
- Add secret files to `.gitignore`.
- Add secret scanning to CI/CD.

IMPORTANT:

Anything sent to browser JavaScript must be considered public.

---

# 9. BROKEN AUTHENTICATION

Audit:

- Login
- Registration
- Password reset
- Email verification
- MFA
- OAuth
- Account recovery
- Logout
- Session management

Requirements:

- Secure password hashing using Argon2id, bcrypt, or an equivalent modern password hashing algorithm.
- Never store plaintext passwords.
- Prevent username/email enumeration where practical.
- Secure password reset tokens.
- Make reset tokens single-use and short-lived.
- Implement account lockout or adaptive throttling carefully.
- Require reauthentication for highly sensitive operations.
- Support MFA where appropriate.
- Properly invalidate sessions after security-sensitive events.

---

# 10. MISSING RATE LIMITING

Implement rate limiting for:

- Login
- Registration
- Password reset
- OTP verification
- MFA attempts
- API endpoints
- Search
- Expensive operations
- File uploads
- Email sending
- Admin endpoints

Requirements:

- Use appropriate limits per IP/user/account/device depending on endpoint.
- Prevent brute force attacks.
- Prevent credential stuffing.
- Prevent OTP brute forcing.
- Prevent API abuse.
- Return appropriate HTTP status codes.
- Avoid rate limiting that can trivially be bypassed through spoofable headers.

Use distributed rate limiting if the application runs across multiple instances.

---

# 11. PROMPT INJECTION / AI SECURITY

If the application uses AI/LLMs, perform a dedicated AI security audit.

Check:

- Direct prompt injection
- Indirect prompt injection
- Malicious uploaded documents
- Malicious webpages
- Tool/function abuse
- Data exfiltration
- System prompt leakage
- Cross-user data leakage
- Excessive agency
- Unsafe tool execution
- Insecure plugins
- Untrusted retrieved content
- RAG poisoning

Requirements:

- Never treat user input as trusted instructions.
- Separate system instructions from untrusted content.
- Apply least privilege to AI tools.
- Require authorization before sensitive actions.
- Validate tool arguments server-side.
- Do not expose secrets to the model.
- Do not allow the model to directly execute arbitrary commands.
- Implement human confirmation for high-impact operations.
- Prevent cross-user context leakage.
- Log security-relevant AI actions.

---

# 12. SECURITY MISCONFIGURATION

Audit:

- Debug mode
- Production configuration
- CORS
- Error messages
- Server headers
- Admin interfaces
- Default credentials
- Open ports
- Unnecessary services
- Directory listing
- Source maps
- Backup files
- Temporary files
- Development endpoints
- Swagger/API documentation exposure
- Database exposure

Requirements:

- Disable debug mode in production.
- Remove default credentials.
- Disable unnecessary services.
- Hide sensitive server information.
- Use secure production configuration.
- Restrict administrative interfaces.
- Remove test/demo endpoints.

---

# 13. SESSION HIJACKING / SESSION MANAGEMENT

Audit:

- Session IDs
- JWTs
- Refresh tokens
- Cookies
- Token rotation
- Logout
- Concurrent sessions

Requirements:

Cookies should use where appropriate:

- `HttpOnly`
- `Secure`
- `SameSite`

Requirements:

- Rotate session identifiers after authentication.
- Invalidate sessions after password changes.
- Secure refresh-token rotation.
- Implement token expiration.
- Revoke compromised sessions.
- Prevent session fixation.
- Never place sensitive tokens in URLs.

---

# 14. UNVALIDATED REDIRECTS

Search for:

- `redirect`
- `returnUrl`
- `next`
- `callback`
- `redirect_uri`
- `continue`

Requirements:

- Allowlist trusted destinations.
- Reject external redirects unless explicitly required.
- Prevent phishing through attacker-controlled redirect URLs.

---

# 15. INSECURE DESERIALIZATION

Audit:

- JSON parsing
- Serialized objects
- Pickle-like mechanisms
- YAML
- Java/.NET serialization
- Custom object reconstruction
- Cache deserialization

Requirements:

- Never deserialize untrusted objects using unsafe native serializers.
- Use safe data formats.
- Validate schemas.
- Reject unexpected fields/types.
- Apply strict input validation.

---

# 16. XXE — XML EXTERNAL ENTITY

If XML is supported:

- Disable external entities.
- Disable DTD processing where unnecessary.
- Disable external resource loading.
- Use secure XML parser configuration.

Test for:

- Local file disclosure
- SSRF
- Entity expansion attacks

---

# 17. CRYPTOGRAPHIC FAILURES

Audit:

- Password hashing
- Encryption
- TLS
- JWT signing
- Token generation
- Random number generation
- Password reset tokens
- API tokens
- Sensitive database fields

Requirements:

- Use modern cryptographic algorithms.
- Never implement custom cryptography.
- Never use MD5/SHA-1 for password storage.
- Use strong random cryptographic generators.
- Use HTTPS/TLS.
- Properly protect encryption keys.
- Avoid hardcoded encryption keys.
- Use authenticated encryption such as AES-GCM or an appropriate modern equivalent where encryption is required.

---

# 18. COMMAND INJECTION

Audit all functionality interacting with:

- Shell commands
- OS processes
- CLI tools
- Image processing
- Video processing
- PDF conversion
- Git commands
- System utilities

Requirements:

- Avoid shell execution when possible.
- Use safe process APIs.
- Never concatenate user input into shell commands.
- Use strict allowlists.
- Run external processes with least privilege.

---

# 19. PATH TRAVERSAL

Test:

- File downloads
- File reads
- File uploads
- Image processing
- Document processing
- Export/import

Block malicious paths such as:

`../`

encoded traversal variants, absolute paths, and platform-specific traversal.

Requirements:

- Canonicalize paths.
- Restrict access to intended directories.
- Never trust user-provided filenames.

---

# 20. UNRESTRICTED FILE UPLOAD

Audit file uploads.

Check:

- MIME type
- File extension
- File content
- File size
- Filename
- Storage location
- Image processing
- Archive extraction

Requirements:

- Allowlist file types.
- Validate actual file content.
- Limit file size.
- Generate server-side filenames.
- Store uploads outside executable directories.
- Prevent executable uploads.
- Scan files where appropriate.
- Protect archive extraction against Zip Slip.
- Do not trust the client's MIME type.

---

# 21. API SECURITY

Audit every API endpoint.

Check:

- Authentication
- Authorization
- Input validation
- Output filtering
- Rate limiting
- Pagination
- Mass assignment
- Excessive data exposure
- Object-level authorization
- Function-level authorization

Prevent:

- API scraping
- Privilege escalation
- Excessive data exposure
- Mass assignment
- Parameter pollution

---

# 22. MASS ASSIGNMENT

Check whether users can submit unexpected fields such as:

- `role`
- `isAdmin`
- `permissions`
- `ownerId`
- `balance`
- `verified`
- `status`

Requirements:

Use explicit allowlists for fields users are allowed to modify.

Never automatically bind arbitrary request fields to database models.

---

# 23. CORS SECURITY

Audit CORS.

Requirements:

- Do not use wildcard origins for authenticated applications.
- Explicitly allow trusted origins.
- Do not blindly reflect the Origin header.
- Review credentialed CORS.
- Restrict allowed methods and headers.

---

# 24. SECURITY HEADERS

Implement appropriate headers, including where applicable:

- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy
- Frame protection through CSP/frame-ancestors or equivalent

Do not blindly copy a generic CSP without testing the application.

---

# 25. DEPENDENCY SECURITY

Audit all dependencies.

Check:

- Outdated packages
- Known CVEs
- Abandoned packages
- Malicious packages
- Dependency confusion
- Lock files
- Transitive dependencies

Requirements:

- Update vulnerable dependencies.
- Remove unnecessary dependencies.
- Lock dependency versions.
- Enable automated dependency scanning.

---

# 26. JWT SECURITY

If JWT is used:

Check:

- Algorithm validation
- Algorithm confusion
- Token expiration
- Issuer
- Audience
- Signature verification
- Key management
- Refresh tokens
- Token revocation

Never trust JWT claims such as role/permissions without proper verification.

---

# 27. OAUTH / SOCIAL LOGIN SECURITY

If OAuth exists:

Check:

- State parameter
- PKCE
- Redirect URI validation
- Token handling
- Account linking
- CSRF
- Open redirects

Never accept arbitrary redirect URIs.

---

# 28. WEBSOCKET SECURITY

If WebSockets are used:

Audit:

- Authentication
- Authorization
- Origin validation
- Message validation
- Rate limiting
- Connection limits
- Cross-user data access

Never assume WebSocket connections are trusted after initial authentication.

---

# 29. WEBHOOK SECURITY

Audit all webhooks.

Requirements:

- Verify signatures.
- Validate timestamps/nonces where supported.
- Prevent replay attacks.
- Validate payload schemas.
- Rate limit requests.
- Do not trust webhook data blindly.

---

# 30. RACE CONDITIONS

Look for race conditions involving:

- Payments
- Wallet/balance operations
- Inventory
- Coupons
- Orders
- Permissions
- Password reset
- Account deletion
- Resource creation

Use transactions, locking, idempotency keys, and server-side validation where appropriate.

---

# 31. BUSINESS LOGIC VULNERABILITIES

Do not only search for technical vulnerabilities.

Understand the application's business logic.

Test:

- Price manipulation
- Quantity manipulation
- Coupon abuse
- Workflow bypass
- Payment bypass
- Account takeover flows
- Privilege escalation
- Verification bypass
- Duplicate transactions
- Negative quantities
- Negative prices
- Hidden endpoint access
- Skipping required steps

---

# 32. INFORMATION DISCLOSURE

Prevent leakage of:

- Passwords
- API keys
- Tokens
- Internal IDs
- Database information
- Stack traces
- File paths
- Internal IPs
- Infrastructure details
- User personal data

Review:

- API responses
- Error responses
- Logs
- Frontend source
- Browser storage

---

# 33. ERROR HANDLING

Production errors must not expose:

- Stack traces
- SQL queries
- Database credentials
- File paths
- Internal service names
- Environment variables

Create safe user-facing errors while retaining detailed information in secure server-side logs.

---

# 34. LOGGING & SECURITY MONITORING

Implement security logging for:

- Login attempts
- Failed authentication
- Password changes
- Email changes
- Permission changes
- Admin actions
- Suspicious requests
- Rate-limit violations
- Token failures
- Security-sensitive operations

Never log:

- Passwords
- Session tokens
- API keys
- Credit card data
- Authentication secrets

---

# 35. DATABASE SECURITY

Apply:

- Least privilege
- Separate application/database users where appropriate
- No public database exposure
- Strong credentials
- TLS where applicable
- Connection restrictions
- Secure backups
- Encryption for sensitive data where required

---

# 36. ENVIRONMENT & INFRASTRUCTURE SECURITY

Audit:

- Docker
- AWS/cloud configuration
- Reverse proxy
- Nginx/Apache
- Firewall
- Security groups
- Storage buckets
- Databases
- CI/CD
- Environment variables

Check for:

- Public storage buckets
- Open databases
- Exposed admin ports
- Overly permissive security groups
- Public cloud metadata access
- Secrets in CI/CD logs

---

# 37. FRONTEND SECURITY

Audit:

- LocalStorage
- SessionStorage
- Cookies
- DOM manipulation
- API calls
- Client-side authorization
- Source maps
- Sensitive data in JavaScript bundles

Never store highly sensitive authentication material in browser storage when a safer architecture is available.

Remember:

**Frontend security controls are not authorization controls.**

---

# 38. PASSWORD SECURITY

Requirements:

- Strong password hashing.
- Password policy appropriate to the application.
- Secure password reset.
- Password breach protection where appropriate.
- Prevent credential stuffing.
- Never expose passwords in logs/API responses.

---

# 39. ACCOUNT ENUMERATION

Check whether attackers can determine whether an account exists through:

- Login
- Registration
- Password reset
- Email verification
- API responses

Use consistent responses where appropriate.

---

# 40. CLICKJACKING

Prevent unauthorized embedding of sensitive pages using appropriate CSP/frame protections.

---

# 41. MIME / CONTENT-TYPE SECURITY

Ensure responses use correct content types.

Prevent MIME sniffing.

---

# 42. HTTP REQUEST SMUGGLING / PROXY ISSUES

If applicable, audit:

- Reverse proxy
- Load balancer
- HTTP/1.1
- HTTP/2
- Transfer-Encoding
- Content-Length handling

Ensure frontend proxy and backend interpret requests consistently.

---

# 43. CACHE SECURITY

Check whether sensitive authenticated responses can be cached.

Prevent sensitive data from being served to the wrong user through shared caches.

---

# 44. PASSWORD RESET SECURITY

Ensure:

- Tokens are cryptographically random.
- Tokens expire.
- Tokens are single-use.
- Tokens cannot be guessed.
- Password reset invalidates appropriate sessions.
- Reset URLs cannot be manipulated through open redirects.

---

# 45. ACCOUNT TAKEOVER PROTECTION

Audit:

- Password reset
- Email change
- Phone change
- MFA reset
- OAuth linking
- Session management

Require appropriate reauthentication for sensitive account changes.

---

# 46. PRIVACY / DATA EXPOSURE

Audit whether users can access:

- Other users' profiles
- Private files
- Orders
- Messages
- Addresses
- Personal information
- Internal records

Apply strict object-level authorization.

---

# 47. SECURITY TESTING

After remediation, perform:

### Static security review

Inspect source code for vulnerabilities.

### Dynamic testing

Test the running application as an unauthenticated user, normal user, privileged user, and administrator.

### API testing

Test every API endpoint.

### Authorization testing

Attempt:

- Horizontal privilege escalation
- Vertical privilege escalation
- IDOR
- Authentication bypass

### Input testing

Test malicious and unexpected input across all input points.

---

# 48. DO NOT BREAK FUNCTIONALITY

Before changing code:

1. Understand existing behavior.
2. Identify dependencies.
3. Make the smallest secure change possible.
4. Preserve API contracts unless a breaking security change is absolutely necessary.
5. Run existing tests.
6. Add security regression tests.
7. Retest affected functionality.

Do NOT disable functionality simply because it is difficult to secure.

---

# 49. SECURITY REGRESSION TESTS

Create automated tests for every discovered vulnerability.

For example:

- SQL injection regression test
- XSS regression test
- IDOR regression test
- Authorization regression test
- CSRF regression test
- SSRF regression test
- Authentication regression test
- Rate-limit regression test
- File-upload regression test
- Path traversal regression test
- Open redirect regression test
- Mass-assignment regression test

The vulnerability must remain fixed after future code changes.

---

# 50. FINAL SECURITY REPORT

At the end, generate a security report containing:

## Executive Summary

Overall security status:

- 🔴 Critical
- 🟠 High
- 🟡 Medium
- 🟢 Low
- 🔵 Informational

## Vulnerability Table

For every finding include:

- Vulnerability
- Location
- Severity
- CWE
- OWASP category
- Description
- Attack scenario
- Impact
- Root cause
- Fix implemented
- Files changed
- Tests performed
- Verification result

Example:

| Vulnerability | Severity | Status |
|---|---|---|
| SQL Injection | 🔴 Critical | Fixed |
| XSS | 🔴 Critical | Fixed |
| IDOR | 🔴 Critical | Fixed |
| CSRF | 🟠 High | Fixed |
| SSRF | 🔴 Critical | Fixed |
| Broken Authentication | 🔴 Critical | Fixed |
| Rate Limiting | 🟠 High | Fixed |

---

# 51. FINAL PRODUCTION SECURITY GATE

Do NOT claim the application is secure merely because obvious vulnerabilities were fixed.

Before declaring:

**READY FOR PRODUCTION**

verify:

- No known Critical vulnerabilities
- No known High vulnerabilities that remain unexplained
- Authentication is secure
- Authorization is server-side
- Sensitive data is protected
- Secrets are not exposed
- Database queries are safe
- File uploads are secure
- APIs are protected
- Rate limiting exists where necessary
- Sessions are secure
- Security headers are configured
- Dependencies are checked
- Error handling is secure
- Logging does not leak secrets
- AI features are hardened if present
- Security regression tests pass

If any critical security issue remains, clearly state:

# ❌ NOT READY FOR PRODUCTION

Do not hide or minimize vulnerabilities.

---

# IMPORTANT RULES

1. Do not trust client-side security controls.
2. Never expose secrets.
3. Never disable authentication/authorization merely to make functionality work.
4. Never use security through obscurity.
5. Never hardcode credentials.
6. Never store plaintext passwords.
7. Never execute untrusted input.
8. Never assume UUIDs prevent IDOR.
9. Never assume CORS protects against CSRF.
10. Never assume frontend validation is sufficient.
11. Never suppress security errors just to make tests pass.
12. Prefer secure-by-default configurations.
13. Use least privilege everywhere.
14. Validate input on the server.
15. Encode/sanitize output appropriately.
16. Keep dependencies updated.
17. Add regression tests for every security fix.
18. Preserve existing functionality whenever safely possible.

---

# FINAL INSTRUCTION

Perform the audit systematically.

Do not simply give me a list of vulnerabilities.

**Actually inspect the application, identify vulnerabilities, implement secure fixes, run tests, perform a second security review, and report the final security status.**

If a vulnerability cannot be safely fixed automatically, clearly identify:

- Why it cannot be fixed automatically
- Exact location
- Risk
- Recommended fix
- Required manual action

The final result must prioritize **security, correctness, maintainability, and production readiness**.