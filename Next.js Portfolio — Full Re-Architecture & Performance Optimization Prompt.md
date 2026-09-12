# Next.js Portfolio — Full System Re-Architecture & Performance Optimization

## ROLE

Act as a **Senior Full-Stack Architect, Next.js Performance Engineer, Security Engineer, and Codebase Refactoring Specialist**.

I already have a fully developed **Next.js portfolio website**.

Your job is **NOT to rebuild the website**.

Your job is to:

1. Analyze the existing codebase.
2. Understand the current frontend and backend architecture.
3. Identify architectural, performance, security, scalability, SEO, and maintainability problems.
4. Re-architect the existing system where necessary.
5. Optimize the existing implementation.
6. Preserve the existing UI/UX, features, routes, content, animations, and behavior unless a change is technically necessary.
7. Avoid unnecessary rewrites.
8. Improve the system incrementally and safely.

The final result should feel like the **same portfolio website**, but with a significantly better internal architecture, performance, security, maintainability, and scalability.

---

# 1. CRITICAL RULE — DO NOT REBUILD

This is an **existing production website**.

DO NOT:

- Create a new portfolio from scratch.
- Replace the existing design.
- Replace the existing UI with a different design.
- Remove existing features.
- Remove existing pages.
- Rewrite everything unnecessarily.
- Change working functionality just for the sake of refactoring.
- Replace technologies without a measurable reason.
- Create duplicate implementations of existing features.
- Introduce unnecessary libraries.
- Convert the entire application to a new architecture blindly.

Instead:

**Inspect → Understand → Measure → Plan → Refactor → Test → Optimize → Verify**

Every architectural change must have a reason.

---

# 2. FIRST PHASE — COMPLETE CODEBASE AUDIT

Before modifying anything, inspect the entire project.

Analyze:

### Frontend

- App Router / Pages Router usage
- Components
- Layouts
- Pages
- Server Components
- Client Components
- Hooks
- Context providers
- State management
- Forms
- Animations
- Images
- Fonts
- CSS
- Tailwind configuration
- shadcn/ui usage
- Third-party libraries
- Dynamic imports
- Suspense usage
- Loading states
- Error boundaries
- Metadata
- SEO implementation

### Backend

Inspect:

- API routes
- Route handlers
- Server Actions
- Authentication
- Authorization
- Database access
- Database queries
- External APIs
- Environment variables
- Email systems
- Contact forms
- Admin functionality
- Webhooks
- Caching
- Rate limiting
- Validation
- Error handling

### Infrastructure

Inspect:

- package.json
- next.config.*
- tsconfig.json
- eslint configuration
- prettier configuration
- environment configuration
- build configuration
- deployment configuration
- GitHub configuration
- Docker configuration if present
- AWS configuration if present
- CDN configuration if present

---

# 3. CREATE AN ARCHITECTURE MAP

Before changing the code, generate an internal architecture report.

Document:

```text
Current Architecture

Browser
   ↓
Next.js
   ↓
Pages / Components
   ↓
API / Server Actions
   ↓
Services
   ↓
Database / External APIs
```

Identify:

- Data flow
- Request flow
- Authentication flow
- Database flow
- API flow
- Component hierarchy
- Dependency relationships
- Critical rendering paths
- Performance bottlenecks
- Security boundaries

Also identify unnecessary coupling.

---

# 4. CREATE A PERFORMANCE BASELINE

Before optimization, measure the current application.

Evaluate:

### Core Web Vitals

- LCP
- INP
- CLS

Also measure:

- First Contentful Paint
- Time to First Byte
- Total Blocking Time
- JavaScript execution time
- Bundle size
- Initial page payload
- Image payload
- Font payload
- CSS payload
- API response time
- Database response time

Analyze the homepage and other important pages.

Do not optimize blindly.

Create a baseline such as:

```text
Before Optimization

LCP: X
INP: X
CLS: X
JS Bundle: X
Initial Load: X
API Response: X
Database Query: X
```

---

# 5. TARGET ARCHITECTURE

Refactor the application toward a clean, scalable Next.js architecture.

Use the existing technology stack wherever possible.

Preferred structure:

```text
src/
│
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── admin/
│   ├── api/
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── sections/
│   ├── forms/
│   └── shared/
│
├── features/
│   ├── projects/
│   ├── contact/
│   ├── authentication/
│   └── ...
│
├── lib/
│   ├── db/
│   ├── auth/
│   ├── validation/
│   ├── security/
│   ├── cache/
│   └── utils/
│
├── services/
│   ├── project.service.ts
│   ├── contact.service.ts
│   └── ...
│
├── hooks/
│
├── types/
│
├── config/
│
└── constants/
```

Do NOT force this structure if the current project already has a better structure.

Adapt the architecture to the existing codebase.

---

# 6. FRONTEND ARCHITECTURE OPTIMIZATION

Optimize the React/Next.js architecture.

## Server Components

Prefer Server Components by default.

Convert unnecessary Client Components to Server Components.

Use `"use client"` only when required for:

- Browser APIs
- Event handlers
- Interactive state
- Client-side effects
- Animation libraries that require the client
- Real-time functionality

Avoid unnecessarily making parent components client-side.

---

# 7. REDUCE JAVASCRIPT

Audit every dependency.

Find:

- Heavy packages
- Duplicate libraries
- Unused packages
- Large client-side dependencies
- Libraries used for simple functionality
- Components unnecessarily included in the initial bundle

Use:

- Dynamic imports
- Code splitting
- Lazy loading
- Tree shaking
- Server Components
- Smaller alternatives where appropriate

Do NOT replace a dependency unless the replacement provides a measurable benefit.

---

# 8. COMPONENT ARCHITECTURE

Refactor components to follow:

```text
Page
 ↓
Section
 ↓
Feature Component
 ↓
Reusable UI Component
```

Avoid:

- Massive components
- Components containing unrelated responsibilities
- Deeply coupled components
- Duplicate components
- Duplicate business logic
- Repeated API logic
- Repeated validation logic

Separate:

```text
UI
Business Logic
Data Access
Validation
Configuration
Utilities
```

---

# 9. DATA FETCHING OPTIMIZATION

Audit all data fetching.

Determine whether each request should use:

- Server Component fetching
- Server Actions
- Route Handlers
- Client fetching
- Static generation
- ISR
- Cached requests
- On-demand revalidation

Avoid unnecessary client-side fetching.

Avoid waterfalls such as:

```text
Request A
   ↓
Request B
   ↓
Request C
```

Where possible, parallelize independent operations.

Use:

```text
Promise.all()
```

when appropriate.

---

# 10. CACHING STRATEGY

Implement a deliberate caching strategy.

Determine:

### Static Data

Use static generation where appropriate.

### Semi-static Data

Use ISR/revalidation.

### Dynamic Data

Use appropriate server-side caching.

### User-specific Data

Do not accidentally cache personalized data publicly.

Document:

```text
Data
→ Cache Strategy
→ Revalidation
→ Invalidation
```

Do not introduce caching that can cause stale or private data to leak.

---

# 11. DATABASE OPTIMIZATION

If the website uses a database:

Audit every query.

Check:

- N+1 queries
- Missing indexes
- Unnecessary SELECT fields
- Duplicate queries
- Large queries
- Inefficient joins
- Connection handling
- Pagination
- Sorting
- Filtering
- Transactions
- Query frequency

Only retrieve the fields actually required.

Example:

```text
BAD

SELECT *

GOOD

SELECT id, title, slug, image, createdAt
```

Add indexes where justified by query patterns.

Do not add random indexes.

---

# 12. API ARCHITECTURE

Refactor APIs toward:

```text
Route Handler
      ↓
Validation
      ↓
Authorization
      ↓
Service Layer
      ↓
Repository / Database
```

Avoid putting large business logic directly inside API routes.

Example:

```text
/api/contact
      ↓
contact.schema.ts
      ↓
contact.service.ts
      ↓
email service
```

---

# 13. VALIDATION

All external input must be validated.

Validate:

- Contact forms
- Login
- Registration
- Admin forms
- API requests
- Query parameters
- URL parameters
- Server Actions

Prefer schema-based validation such as Zod if it is already part of the project.

Never trust client-side validation alone.

---

# 14. SECURITY HARDENING

Perform a security audit.

Check:

- Authentication
- Authorization
- Session handling
- CSRF protection where applicable
- XSS
- SQL injection
- Command injection
- SSRF
- Rate limiting
- Input validation
- File upload security
- CORS
- Security headers
- Cookie configuration
- Sensitive data exposure
- Environment variables
- API abuse
- Error information leakage

Never expose:

- API secrets
- Database credentials
- Private environment variables
- Internal stack traces
- Sensitive user information

Use secure cookies where authentication requires them.

---

# 15. ENVIRONMENT VARIABLES

Audit all environment variables.

Separate:

```text
PUBLIC
PRIVATE
SERVER ONLY
```

Never expose server secrets through:

```text
NEXT_PUBLIC_*
```

Create a centralized environment validation system if appropriate.

Fail safely when required environment variables are missing.

---

# 16. IMAGE OPTIMIZATION

Audit every image.

Use Next.js image optimization where appropriate.

Check:

- Image dimensions
- Image formats
- Image compression
- Responsive images
- Lazy loading
- Priority loading
- Above-the-fold images
- LCP image

Do not lazy-load the primary LCP image.

Do not load huge images when small versions are sufficient.

---

# 17. FONT OPTIMIZATION

Audit fonts.

Use optimized Next.js font loading where possible.

Avoid:

- Excessive font families
- Excessive font weights
- Render-blocking external font requests

Load only required weights.

---

# 18. CSS OPTIMIZATION

Audit:

- Global CSS
- Tailwind usage
- Duplicate styles
- Unused CSS
- Large CSS files
- Excessive animations
- Expensive selectors

Avoid unnecessary CSS complexity.

Preserve the current visual design.

---

# 19. ANIMATION OPTIMIZATION

The portfolio may contain animations.

Do NOT remove animations simply to improve performance.

Instead:

- Use GPU-friendly properties
- Prefer transform/opacity
- Avoid expensive layout-triggering animations
- Reduce unnecessary animation calculations
- Lazy-load heavy animation libraries
- Avoid running animations when not visible
- Respect `prefers-reduced-motion`

Animations must remain visually equivalent wherever possible.

---

# 20. THREE.JS / CANVAS / WEBGL

If the portfolio uses:

- Three.js
- React Three Fiber
- WebGL
- Canvas
- Particle systems

audit them carefully.

Optimize:

- Render loops
- Object count
- Geometry
- Textures
- Shaders
- DPR
- Memory usage
- GPU usage
- Mobile performance

Do not continuously render when nothing changes.

Use lazy loading for heavy visual experiences where appropriate.

---

# 21. MOBILE PERFORMANCE

Test specifically for mobile.

Optimize for:

- Low-end devices
- Slow networks
- 4G
- High latency
- Limited CPU
- Limited GPU
- Battery usage

Do not optimize only for a powerful desktop machine.

---

# 22. SEO ARCHITECTURE

Audit:

- Metadata
- Title
- Description
- Open Graph
- Twitter/X cards
- Canonical URLs
- Sitemap
- robots.txt
- Structured data
- Semantic HTML
- Heading hierarchy
- Image alt text

Preserve existing SEO information.

Improve missing areas without changing existing SEO unnecessarily.

---

# 23. ACCESSIBILITY

Audit against WCAG principles.

Check:

- Keyboard navigation
- Focus states
- Screen readers
- ARIA usage
- Semantic HTML
- Color contrast
- Form labels
- Error messages
- Button accessibility
- Reduced motion

Do not use ARIA when native HTML already provides the correct semantics.

---

# 24. ERROR HANDLING

Implement consistent error handling.

Use appropriate:

- `error.tsx`
- `not-found.tsx`
- API error responses
- Server error handling
- Validation errors
- Logging

Never expose internal implementation details to users.

Create useful developer logs while keeping production responses safe.

---

# 25. LOADING STATES

Audit loading behavior.

Implement appropriate:

- `loading.tsx`
- Suspense boundaries
- Skeletons
- Streaming

Do not create unnecessary loading screens.

The website should feel fast and responsive.

---

# 26. LOGGING & MONITORING

Create a clean logging strategy.

Separate:

```text
Development Logs
Production Logs
Security Logs
Error Logs
Performance Logs
```

Avoid excessive console logging in production.

If monitoring already exists, optimize its implementation instead of replacing it.

---

# 27. NETWORK OPTIMIZATION

Audit:

- API requests
- External requests
- Third-party scripts
- Analytics
- Fonts
- Images
- Preconnect
- DNS lookup
- Request waterfalls

Remove unnecessary third-party requests.

Every external request must have a reason.

---

# 28. THIRD-PARTY SCRIPT AUDIT

Find all:

- Analytics
- Tracking
- Chat widgets
- Social embeds
- Maps
- External APIs
- Fonts
- Payment systems
- Other scripts

Determine:

```text
Is it required?
When is it loaded?
Does it block rendering?
Can it be lazy-loaded?
Can it be removed?
```

Do not remove functionality without permission.

---

# 29. DEPENDENCY AUDIT

Analyze:

```text
package.json
package-lock.json
```

Find:

- Unused dependencies
- Duplicate dependencies
- Outdated dependencies
- Heavy dependencies
- Security vulnerabilities

Do not blindly upgrade everything.

For each upgrade consider:

```text
Breaking Changes
Compatibility
Performance
Security
Stability
```

---

# 30. TYPESCRIPT QUALITY

Improve TypeScript quality.

Avoid:

```typescript
any
```

where a proper type can be created.

Improve:

- Interfaces
- Types
- API response types
- Database types
- Form types
- Component props

Avoid over-engineering the type system.

---

# 31. STATE MANAGEMENT

Audit global state.

Find state that can be:

- Server state
- URL state
- Local component state
- Derived state

Avoid putting everything into global state.

Remove unnecessary Context providers.

Providers should not unnecessarily force large parts of the application into client rendering.

---

# 32. SECURITY + PERFORMANCE BALANCE

Never optimize performance by weakening security.

Examples:

DO NOT:

- Disable authentication for speed.
- Remove validation.
- Expose database queries.
- Cache private data publicly.
- Disable security headers.
- Move secrets to the client.
- Remove authorization checks.

Performance improvements must maintain security.

---

# 33. ARCHITECTURAL PRINCIPLES

Follow:

### SOLID

Use appropriate SOLID principles.

### DRY

Remove meaningful duplication.

### KISS

Do not over-engineer.

### Separation of Concerns

Separate:

```text
Presentation
Business Logic
Data Access
Infrastructure
```

### Single Responsibility

Each module should have a clear responsibility.

---

# 34. REFACTORING STRATEGY

Do NOT make one giant rewrite.

Use incremental phases:

```text
Phase 1
Audit

Phase 2
Architecture Plan

Phase 3
Performance Baseline

Phase 4
Frontend Optimization

Phase 5
Backend Optimization

Phase 6
Database Optimization

Phase 7
Security Hardening

Phase 8
SEO + Accessibility

Phase 9
Testing

Phase 10
Final Performance Validation
```

After each major phase:

```text
Run build
Run lint
Run type-check
Run tests
Verify routes
Verify UI
Verify functionality
```

Fix regressions immediately.

---

# 35. ZERO REGRESSION REQUIREMENT

Before and after every major refactor verify:

### Pages

All existing pages still work.

### Navigation

All navigation works.

### Forms

All forms work.

### API

All API endpoints work.

### Authentication

Authentication behavior remains correct.

### Animations

Animations remain functional.

### Responsive Design

Desktop, tablet and mobile remain correct.

### SEO

Metadata remains correct.

### Accessibility

Existing accessibility must not regress.

---

# 36. PERFORMANCE TARGETS

Aim for:

### Lighthouse

```text
Performance: 90+
Accessibility: 95+
Best Practices: 95+
SEO: 95+
```

Where realistically achievable.

### Core Web Vitals

Target:

```text
LCP < 2.5s
INP < 200ms
CLS < 0.1
```

Do not artificially manipulate Lighthouse scores.

Optimize the actual user experience.

---

# 37. BUNDLE ANALYSIS

Analyze the production bundle.

Identify:

```text
Largest JavaScript modules
Largest dependencies
Client components
Heavy libraries
Duplicate modules
Unused code
```

Use bundle analysis tools where appropriate.

Document the biggest improvements.

---

# 38. BUILD OPTIMIZATION

Optimize the Next.js build.

Check:

- Build time
- Static generation
- Server rendering
- Bundle splitting
- Tree shaking
- Dependency optimization
- Image handling
- Font handling

The production build must complete successfully.

---

# 39. DOCUMENTATION

After the refactor create/update:

```text
ARCHITECTURE.md
PERFORMANCE.md
SECURITY.md
```

Document:

### Architecture

- Folder structure
- Data flow
- API architecture
- Database architecture

### Performance

- Before metrics
- After metrics
- Major optimizations

### Security

- Authentication
- Authorization
- Validation
- Security headers
- Rate limiting
- Secret management

---

# 40. CHANGE LOG

Maintain a clear record:

```text
CHANGELOG_ARCHITECTURE.md
```

For every major change:

```text
Problem
Current Implementation
Why It Was a Problem
Solution
Why This Solution
Performance Impact
Risk
Testing Performed
```

---

# 41. DO NOT MAKE ASSUMPTIONS

Before changing anything:

Inspect the actual implementation.

Do not assume:

- Database technology
- Authentication system
- Hosting provider
- API architecture
- Folder structure
- State management
- Deployment system

Use the actual codebase as the source of truth.

---

# 42. IMPLEMENTATION RULE

For every proposed optimization ask:

```text
1. What is the current problem?
2. How was the problem measured?
3. What is the proposed solution?
4. What functionality could be affected?
5. What is the expected performance improvement?
6. How will it be tested?
```

If there is no meaningful benefit, do not make the change.

---

# 43. FINAL VALIDATION

At the end run:

```text
npm run build
npm run lint
npm run type-check
npm test
```

Use only commands that actually exist in the project.

If a command does not exist, do not invent it.

Also verify:

- All routes
- All API endpoints
- Forms
- Authentication
- Responsive layouts
- Animations
- Images
- SEO
- Accessibility
- Production build

---

# 44. FINAL REPORT

After completing the work, provide a detailed report:

## Architecture

```text
Before
→
After
```

## Performance

```text
Metric              Before       After
------------------------------------------------
LCP                 X            X
INP                 X            X
CLS                 X            X
JS Bundle           X            X
Page Load           X            X
API Response        X            X
Build Time          X            X
```

## Major Changes

List every major architectural improvement.

## Removed

List:

- Removed dependencies
- Removed duplicate code
- Removed unnecessary client components
- Removed unnecessary requests
- Removed unnecessary state

## Security Improvements

List all security improvements.

## SEO Improvements

List all SEO improvements.

## Accessibility Improvements

List all accessibility improvements.

## Remaining Issues

Clearly list anything that could not be optimized.

---

# 45. MOST IMPORTANT REQUIREMENT

The final website must satisfy:

```text
SAME WEBSITE
+
SAME FEATURES
+
SAME USER EXPERIENCE
+
SAME DESIGN
+
BETTER ARCHITECTURE
+
LESS JAVASCRIPT
+
FASTER LOADING
+
BETTER DATABASE PERFORMANCE
+
BETTER API PERFORMANCE
+
BETTER SECURITY
+
BETTER SEO
+
BETTER ACCESSIBILITY
+
BETTER MAINTAINABILITY
+
BETTER SCALABILITY
```

Do not confuse **re-architecting** with **rebuilding**.

The objective is to transform the existing codebase into a **production-grade, high-performance Next.js application while preserving the existing portfolio experience**.

Start with the audit and architecture report first.

**Do not make destructive changes until the existing architecture has been understood.**