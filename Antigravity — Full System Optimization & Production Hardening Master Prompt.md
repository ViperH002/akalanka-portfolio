# ANTIGRAVITY — FULL SYSTEM OPTIMIZATION & PRODUCTION HARDENING

## ROLE

Act as a senior:

- Software Architect
- Backend Engineer
- Frontend Engineer
- Database Engineer
- Performance Engineer
- Security Engineer
- DevOps / Cloud Engineer
- QA Engineer
- Site Reliability Engineer (SRE)

You are working on an **EXISTING software system**.

Your responsibility is to analyze the current implementation, identify weaknesses, create an optimization plan, implement safe improvements, test everything, and verify that the system is production-ready.

---

# ⚠️ MOST IMPORTANT RULE

## DO NOT REWRITE THE SYSTEM FROM SCRATCH.

Do not replace the current architecture, framework, database, libraries, or major components unless there is a strong technical reason.

Preserve:

- Existing functionality
- Existing user workflows
- Existing API contracts
- Existing database behavior
- Existing authentication behavior
- Existing UI/UX behavior
- Existing integrations

The objective is:

> IMPROVE THE EXISTING SYSTEM — NOT REBUILD IT.

Before making changes, understand the existing system.

---

# PHASE 0 — CREATE A SAFE WORKING STATE

Before making modifications:

1. Inspect Git status.
2. Identify the current branch.
3. Check whether there are uncommitted changes.
4. Do not overwrite unrelated user changes.
5. Identify the current working version.
6. Inspect existing tests.
7. Inspect build configuration.
8. Identify development/staging/production configurations.
9. Identify environment variables without exposing their values.
10. Identify database migration strategy.

Create a baseline record:

```text
Project:
Current Branch:
Framework:
Language:
Package Manager:
Database:
Deployment:
Build System:
Test System:
Current Git Status:
```

If the repository has existing uncommitted work, preserve it.

Never delete user work simply to make the optimization easier.

---

# PHASE 1 — COMPLETE SYSTEM DISCOVERY

Before changing code, inspect the project.

Analyze:

```text
Project Structure
├── Frontend
├── Backend
├── API
├── Business Logic
├── Database
├── Authentication
├── Authorization
├── Storage
├── External Services
├── Background Jobs
├── Configuration
├── Tests
├── Infrastructure
└── Deployment
```

Determine:

- What technologies are being used?
- How does the application start?
- How does a request flow through the system?
- Where is business logic located?
- How does authentication work?
- How does authorization work?
- How is data stored?
- How are errors handled?
- How are logs generated?
- How is deployment performed?
- Which external services are used?

Do not make assumptions when the codebase can answer the question.

---

# PHASE 2 — GENERATE SYSTEM ARCHITECTURE MAP

Create an architecture description based on the actual code.

Example:

```text
Client
 ↓
Frontend
 ↓
API
 ↓
Authentication
 ↓
Business Logic
 ↓
Database
 ↓
External Services
```

Identify:

- Data flow
- Request flow
- Authentication flow
- Authorization flow
- Database flow
- File flow
- External API flow
- Background processing
- Caching
- Logging

Identify unnecessary communication and duplicated processing.

---

# PHASE 3 — BASELINE MEASUREMENTS

Before optimization, establish measurable baselines where possible.

Measure:

### Application

- Startup time
- Build time
- Response time
- Error rate
- CPU usage
- Memory usage

### API

- Average latency
- Slowest endpoints
- Request count
- Payload size
- Error rate

### Database

- Slow queries
- Query execution time
- Number of queries/request
- Connection usage
- Missing indexes

### Frontend

- Bundle size
- Initial load
- JavaScript size
- Image size
- Number of requests
- Rendering issues

Do not invent measurements.

If a metric cannot currently be measured, explicitly state:

```text
NOT CURRENTLY MEASURABLE
```

and recommend how to measure it.

---

# PHASE 4 — SECURITY AUDIT

Perform a complete security review before performance optimization.

Check:

## Authentication

- Password handling
- Session management
- Token handling
- Token expiration
- Logout
- Password reset
- Email verification
- MFA if applicable
- Brute-force protection

## Authorization

Check for:

- IDOR
- BOLA
- Privilege escalation
- Missing permission checks
- Client-side-only authorization

IMPORTANT:

Never trust authorization performed only in the frontend.

Authorization must be enforced server-side.

## Input Security

Check:

- SQL injection
- XSS
- CSRF
- SSRF
- Command injection
- Path traversal
- Unsafe file uploads
- Malformed input

## Secrets

Search for accidentally committed:

- API keys
- Passwords
- Tokens
- Private keys
- Database credentials
- Cloud credentials

Never print discovered secret values.

Report only:

```text
Secret detected:
Location:
Type:
Recommended remediation:
```

## Configuration

Check:

- CORS
- Cookies
- Security headers
- HTTPS
- Debug mode
- Production error exposure
- Rate limiting

Follow current OWASP best practices.

---

# PHASE 5 — ARCHITECTURE AUDIT

Review:

- Coupling
- Cohesion
- Modularity
- Separation of concerns
- Dependency direction
- Circular dependencies
- Duplicate logic
- God classes
- God components
- Dead code
- Over-engineering
- Under-engineering

Do not introduce microservices unless there is a real requirement.

Prefer the smallest architecture change that provides meaningful improvement.

---

# PHASE 6 — CODE QUALITY AUDIT

Search for:

- Duplicate code
- Unused code
- Unused dependencies
- Large functions
- Large components
- Deep nesting
- Magic numbers
- Hardcoded configuration
- Poor naming
- Weak typing
- Inconsistent patterns
- Poor error handling
- Race conditions
- Blocking operations

Apply:

- SOLID
- DRY
- KISS
- Separation of Concerns

Do not make code unnecessarily abstract.

Readable code is preferred over clever code.

---

# PHASE 7 — DATABASE OPTIMIZATION

Inspect the database schema and actual queries.

Analyze:

- Tables
- Relationships
- Foreign keys
- Indexes
- Constraints
- Query patterns
- Transactions
- Locks
- Connection pooling
- Pagination
- Filtering
- Sorting
- Aggregations

Look specifically for:

## N+1 queries

Example:

```text
1 query → users

100 queries → orders
```

Replace with appropriate batching/joining/data-loading strategies.

## Missing indexes

Identify queries that would benefit from indexes.

## Excessive data retrieval

Avoid:

```sql
SELECT *
```

when only a subset is required.

## Large datasets

Use:

- Pagination
- Cursor pagination
- Batching
- Appropriate indexes

Never make destructive schema changes without a migration.

---

# PHASE 8 — BACKEND/API OPTIMIZATION

Inspect every important endpoint.

For each endpoint determine:

```text
Request
 ↓
Authentication
 ↓
Authorization
 ↓
Validation
 ↓
Business Logic
 ↓
Database
 ↓
External Services
 ↓
Response
```

Optimize:

- Database calls
- External requests
- Serialization
- Response size
- Duplicate work
- Blocking operations
- Unnecessary API requests

Implement appropriate:

- Pagination
- Validation
- Rate limiting
- Timeouts
- Caching
- Error handling

Do not change API contracts unnecessarily.

---

# PHASE 9 — FRONTEND OPTIMIZATION

Inspect:

- Bundle size
- Component rendering
- Re-renders
- API requests
- Images
- Fonts
- JavaScript
- CSS
- State management
- Client-side storage

Look for:

- Unnecessary client-side code
- Duplicate requests
- Large dependencies
- Unnecessary re-renders
- Large images
- Unused assets

Use appropriate:

- Lazy loading
- Code splitting
- Dynamic imports
- Image optimization
- Caching

Do not change the UI design unless required for performance or explicitly requested.

---

# PHASE 10 — MEMORY / CPU OPTIMIZATION

Identify:

- Memory leaks
- Unbounded arrays
- Unbounded caches
- Large objects
- Connection leaks
- Long-running processes
- Expensive calculations
- Repeated calculations

Check for:

```text
CPU spikes
Memory growth
Connection exhaustion
Long-running tasks
```

Fix the root cause rather than hiding the symptom.

---

# PHASE 11 — CACHING AUDIT

Identify data that could safely be cached.

Possible locations:

```text
Browser
 ↓
CDN
 ↓
Application
 ↓
Redis
 ↓
Database
```

For every proposed cache document:

```text
What:
Why:
TTL:
Invalidation:
Failure behavior:
Stale-data risk:
```

Never introduce caching blindly.

---

# PHASE 12 — NETWORK OPTIMIZATION

Review:

- Request count
- Payload sizes
- API round trips
- Compression
- CDN
- HTTP caching
- External requests

Reduce unnecessary network communication.

Do not sacrifice correctness for small latency improvements.

---

# PHASE 13 — ASYNC / BACKGROUND PROCESSING

Identify operations that don't need to block user requests.

Examples:

```text
Email sending
Image processing
Report generation
Large calculations
Notifications
Data synchronization
```

Consider:

```text
Request
 ↓
Queue
 ↓
Worker
 ↓
Processing
```

Only introduce queues when the workload justifies them.

---

# PHASE 14 — RELIABILITY AUDIT

Assume dependencies can fail.

Test or inspect behavior when:

- Database is unavailable
- External API fails
- Network times out
- Server restarts
- Requests are duplicated
- Traffic spikes
- Memory becomes constrained

Review:

- Timeouts
- Retry logic
- Exponential backoff
- Retry limits
- Circuit breakers
- Graceful degradation
- Graceful shutdown
- Health checks

Never create infinite retries.

---

# PHASE 15 — SCALABILITY AUDIT

Determine current scaling limitations.

Analyze:

- CPU
- RAM
- Database
- Connection limits
- Storage
- Network
- Local state
- Sessions
- File storage
- Background jobs

Ask:

> Can this system safely handle 10× its current workload?

Identify the first components likely to fail.

Do not implement expensive distributed infrastructure unless justified.

---

# PHASE 16 — TESTING AUDIT

Review existing:

- Unit tests
- Integration tests
- API tests
- E2E tests
- Security tests
- Load tests

Identify critical paths without coverage.

Prioritize tests for:

```text
Authentication
Authorization
Payments
Data modification
Important business logic
Critical API endpoints
```

Never remove tests just to make the project pass.

---

# PHASE 17 — DEPENDENCY AUDIT

Review dependencies for:

- Vulnerabilities
- Unused packages
- Duplicate packages
- Outdated packages
- Large unnecessary dependencies

Do not blindly upgrade everything.

For each upgrade determine:

```text
Current version
Target version
Reason
Breaking changes
Risk
Required code changes
```

---

# PHASE 18 — OBSERVABILITY AUDIT

Check whether the system can answer:

```text
What failed?
Where did it fail?
Why did it fail?
How many users are affected?
How long did it take?
```

Review:

### Logs

Use structured logs where appropriate.

Never log:

- Passwords
- API keys
- Tokens
- Private credentials
- Sensitive information unnecessarily

### Metrics

Monitor:

- CPU
- Memory
- Requests
- Errors
- Latency
- Database performance
- Cache hit rate
- Queue length

### Tracing

Where appropriate trace:

```text
Request
 ↓
API
 ↓
Service
 ↓
Database
 ↓
External API
```

---

# PHASE 19 — INFRASTRUCTURE / DEPLOYMENT AUDIT

Inspect:

- Server configuration
- Containers
- Cloud resources
- Database
- CDN
- Load balancer
- Storage
- Networking
- SSL/TLS
- Backups
- Monitoring

Check whether infrastructure is:

- Over-provisioned
- Under-provisioned
- Missing redundancy
- Missing backups
- Missing monitoring
- Too expensive

---

# PHASE 20 — CI/CD AUDIT

Review the pipeline.

Recommended:

```text
Git Push
 ↓
Lint
 ↓
Type Check
 ↓
Unit Tests
 ↓
Security Scan
 ↓
Build
 ↓
Integration Tests
 ↓
Staging
 ↓
Smoke Tests
 ↓
Production
```

Ensure failed quality checks prevent unsafe deployment.

---

# PHASE 21 — CREATE OPTIMIZATION PLAN

After completing the audit, create:

```text
OPTIMIZATION PLAN
```

For every issue include:

```text
ID:
Category:
Severity:
Location:
Problem:
Root Cause:
Impact:
Recommended Solution:
Risk:
Estimated Complexity:
Dependencies:
Expected Benefit:
```

Prioritize:

🔴 CRITICAL
🟠 HIGH
🟡 MEDIUM
🟢 LOW

---

# PHASE 22 — IMPLEMENTATION

Only after creating the plan should you begin implementation.

Implementation rules:

1. Fix critical security issues first.
2. Fix production-breaking reliability problems.
3. Fix high-impact performance bottlenecks.
4. Optimize database/API performance.
5. Improve scalability.
6. Improve observability.
7. Improve testing.
8. Improve maintainability.
9. Apply low-priority optimizations last.

Make changes incrementally.

After each logical group of changes:

```text
Run tests
 ↓
Run type checking
 ↓
Run lint
 ↓
Build
 ↓
Verify functionality
```

If something breaks:

```text
STOP
↓
Identify root cause
↓
Fix
↓
Re-run validation
```

Do not continue stacking changes on top of a broken state.

---

# PHASE 23 — PERFORMANCE VERIFICATION

After optimization, compare:

```text
BEFORE vs AFTER
```

Measure where possible:

```text
API latency
Database query time
CPU
Memory
Bundle size
Build time
Page load
Request count
Error rate
```

Calculate actual improvement.

Example:

```text
Database Query

Before: 820ms
After: 95ms

Improvement: 88.4%
```

Never claim an improvement that was not measured.

---

# PHASE 24 — REGRESSION TESTING

Verify:

- Existing features
- Authentication
- Authorization
- Database operations
- API endpoints
- Important user workflows
- UI functionality
- External integrations

Confirm that optimization did not change intended behavior.

---

# PHASE 25 — FINAL SECURITY VERIFICATION

After implementation, perform another security pass.

Verify:

- No secrets introduced
- No authorization bypass
- No authentication regression
- No insecure endpoints
- No exposed debug information
- No new dependency vulnerabilities
- No unsafe configuration
- No sensitive logging

---

# PHASE 26 — PRODUCTION READINESS REVIEW

Give the system a final score:

```text
Architecture:        /10
Security:            /10
Performance:         /10
Database:            /10
Backend/API:         /10
Frontend:            /10
Scalability:         /10
Reliability:         /10
Testing:             /10
Observability:       /10
Infrastructure:      /10
Maintainability:     /10
Cost Efficiency:     /10

OVERALL:             /10
```

Then provide:

```text
PRODUCTION STATUS:

READY
or
READY WITH CONDITIONS
or
NOT READY
```

Explain exactly why.

---

# REQUIRED FINAL REPORT

Generate the following final report:

## 1. Executive Summary

What was found and what was improved.

## 2. Current Architecture

Describe the actual architecture.

## 3. Critical Issues

List critical problems.

## 4. Security Findings

List vulnerabilities and remediation.

## 5. Performance Findings

List bottlenecks and improvements.

## 6. Database Findings

List database problems and improvements.

## 7. API Findings

List API/backend issues.

## 8. Frontend Findings

List frontend performance issues.

## 9. Scalability Findings

Identify current scaling limitations.

## 10. Reliability Findings

Identify failure scenarios.

## 11. Testing Findings

Identify missing test coverage.

## 12. Infrastructure Findings

Identify infrastructure improvements.

## 13. Before vs After

Provide measurable improvements.

## 14. Files Changed

List every modified file.

For each:

```text
File:
Change:
Reason:
Risk:
```

## 15. Database Changes

List migrations/schema changes separately.

## 16. Configuration Changes

List environment/configuration changes.

Never expose secret values.

## 17. Remaining Issues

Clearly list issues that were NOT fixed.

## 18. Recommended Next Steps

Prioritize future improvements.

---

# 🔴 HARD SAFETY RULES

NEVER:

- Delete user code without justification.
- Delete existing tests to make builds pass.
- Disable security mechanisms.
- Disable authentication.
- Disable authorization.
- Remove validation.
- Hardcode secrets.
- Expose environment variables.
- Modify production databases destructively.
- Drop tables without explicit authorization.
- Perform destructive load testing against production.
- Upgrade all dependencies blindly.
- Rewrite the entire system unnecessarily.
- Introduce microservices without justification.
- Introduce Redis/queues/Kafka/etc. without a real requirement.
- Claim performance improvements without measurement.
- Change UI/UX unnecessarily.
- Change API contracts unnecessarily.

---

# DECISION RULE

Whenever considering a change, ask:

1. What problem does this solve?
2. Is the problem actually present?
3. What evidence supports the change?
4. What is the expected benefit?
5. What could break?
6. Is there a smaller/simpler solution?
7. Can the improvement be measured?
8. Does it introduce new complexity?
9. Does it affect security?
10. Does it affect scalability?
11. Does it affect existing functionality?

Choose the solution with the best overall engineering trade-off.

---

# ENGINEERING PRINCIPLE

Do not optimize based on assumptions.

Use:

```text
DISCOVER
   ↓
MEASURE
   ↓
ANALYZE
   ↓
PLAN
   ↓
IMPLEMENT
   ↓
TEST
   ↓
VERIFY
   ↓
MONITOR
```

The goal is not to produce the most complicated system.

The goal is to produce the:

**FASTEST PRACTICAL + SECURE + RELIABLE + SCALABLE + MAINTAINABLE + COST-EFFICIENT**

version of the existing system.

Treat this as a real production engineering project.