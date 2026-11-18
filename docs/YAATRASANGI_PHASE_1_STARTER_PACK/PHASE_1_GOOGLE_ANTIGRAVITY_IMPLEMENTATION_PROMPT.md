# Google Antigravity Prompt — YaatraSangi Phase 1

> **Phase:** 1 — Security, Build Remediation and Architecture Foundation  
> **Mode:** Controlled implementation in the existing repository  
> **Authority:** Founder-approved ADRs 001, 002 and 003  
> **Repository:** Existing YaatraSangi monorepo  
> **Do not begin Phase 2 partner-management feature development in this phase.**

## 0. Your role

Act as a senior staff software engineer, application security engineer, database migration engineer and release engineer.

Implement Phase 1 in the existing YaatraSangi repository. Preserve working functionality that remains aligned with the approved product. Make small, reviewable changes, run tests and document evidence. Do not perform a broad rewrite.

Read these files first:
- `docs/YAATRASANGI_CORRECTED_MASTER_IMPLEMENTATION_SPEC.md`
- All reports under `docs/phase-0/`
- `docs/architecture/ADR-001-LOCAL-RIDE-DIRECTORY-ONLY.md`
- `docs/architecture/ADR-002-UNIFIED-NEXTJS-MINI-SITE-RUNTIME.md`
- `docs/architecture/ADR-003-POSTGRESQL-SINGLE-AUTHORITATIVE-SCHEMA.md`

If an ADR file is not yet present, use the corresponding file supplied with this prompt pack and copy it into `docs/architecture/` without changing its decision. Any proposed change must be raised as a documented exception for founder approval.

## 1. Product rules — non-negotiable

YaatraSangi is a discovery/direct-connection mediator, not an OTA or ride-hailing operator.

- Do not implement customer hotel/taxi bookings, room holds, booking confirmations, customer checkout, customer payments, booking commissions, refunds or partner payouts.
- Customers contact hotels, taxi operators, restaurants, tour operators and local ride providers directly. Booking, payment, cancellation and fulfilment occur outside YaatraSangi.
- Enquiries/leads are not bookings.
- Restaurants are permanently free.
- Local bike, auto-rickshaw and city-cab providers are permanently free.
- Hotels, outstation taxi operators and tour operators are paid annual-subscription categories.
- Eligible paid business profiles receive one six-month trial after verification/activation. Do not issue repeated trials.
- Monthly plans are out of scope. Exact annual prices remain configurable and unfinalized.
- One owner may manage multiple business profiles; businesses may have multiple locations.
- One approved business profile receives one subdomain mini-site.
- Partner content edits must not replace the currently published revision before admin approval.
- Keep traveller website and mobile apps as separate experiences sharing backend contracts and business logic.

## 2. Repository baseline — verify before changing anything

Phase 0 recorded:
- Branch: `modification/completeRestructureProject`
- HEAD: `b2865712ef536475ad46223a74987f608935eaa8`
- Phase 0 audit baseline: `6cd501b170590ff67df16a6ba5f93d5dcfb5c628`
- Zero application-code changes between those commits at Phase 0.
- Working tree was clean at Phase 0.
- Node.js `v26.12.1`; npm `11.20.0`; package.json declared `npm@11.17.0`.
- Docker CLI was not installed / not in PATH.
- Backend: 41 tests passed; backend build passed.
- Traveller web: Next.js 16.3.6 static export build passed (42 pages).
- Mobile `npx tsc --noEmit` failed with 12 diagnostic entries in the detailed compiler output (the summary says 11).

These are historical baseline facts. Re-run checks in the current environment and record the actual current results. Do not assume the working tree or commit is unchanged.

### Mandatory first actions

1. Run and record `git status --short`, current branch, HEAD commit, `git diff`, and `git diff --cached`.
2. If there are uncommitted or untracked files, classify them as **USER WORK — DO NOT OVERWRITE**. Do not reset, stash, clean, checkout over, or delete them.
3. Confirm the repository root and package manager. Do not upgrade Node/npm or install Docker as part of this phase without explicit approval.
4. Create a new working branch from the current intended base, but only after confirming no user work will be lost. Suggested name: `phase-1/security-and-foundation`.
5. Do not amend, force-push or rewrite existing commits.
6. Capture baseline commands/results before fixes.

If any of these safety checks fail, stop and report. Do not improvise destructive workarounds.

## 3. Phase 1 scope and execution order

### Workstream 1 — P0 security remediation

#### SEC-01: Admin authorization
Reported evidence: `apps/traveller-web/src/app/admin/page.tsx` uses a `localStorage` flag (`superAdminAuth`) and hardcoded email allow-list; a redirect check is commented out.

Required:
- Treat browser storage and frontend route hiding as untrusted presentation state only.
- Identify every admin API and sensitive action.
- Enforce role/permission authorization on the backend for every admin endpoint and resource operation.
- Use existing auth infrastructure where sound; do not invent a second incompatible auth system.
- Remove hardcoded admin email authorization.
- Remove the localStorage super-admin bypass.
- Ensure unauthenticated/non-admin users cannot perform admin operations by calling APIs directly.
- Protect admin seed/destructive routes; disable them in production unless a documented secure operational mechanism exists.
- Add positive and negative authorization tests.

Do not claim that hiding the admin page itself secures the API.

#### SEC-02: Database and Redis network exposure
Reported evidence: Compose files publish PostgreSQL `5432` and Redis `6379` without loopback binding; Redis configuration reportedly has no authentication.

Required:
- Inspect actual development and production Compose files and Docker network topology.
- Prefer no host-published DB/Redis ports in production. If local host access is genuinely required, bind to `127.0.0.1` only and document why.
- Ensure API-to-database/cache communication uses the private Compose network.
- Configure Redis authentication/ACL and avoid exposing Redis publicly.
- Do not assume firewall rules compensate for unsafe Compose defaults.
- Preserve development usability where safe.
- Validate Compose if Docker is available. If not, use static validation only where appropriate and clearly mark runtime validation NOT RUN. Do not install Docker.

#### SEC-03: Secret fallback removal
Reported evidence includes fallback values for `JWT_SECRET` and Razorpay webhook secrets in API code and Compose defaults.

Required:
- Remove insecure fallback secrets from production paths.
- Fail application startup with a clear, non-secret error when required production secrets are missing or too weak.
- Use environment-specific configuration validation.
- Do not print secret values.
- Provide `.env.example` placeholders only; never add real credentials.
- Keep payment gateway credentials optional only when the payment feature is disabled in the environment.
- Ensure no customer booking payment route is restored by this work.

### Workstream 2 — P1 API security controls

#### SEC-04: Validation and rate limiting
- Add global NestJS DTO validation using appropriate `ValidationPipe` settings (`whitelist`, `transform`, and reject unknown fields where compatible).
- Confirm DTOs actually use validators; do not assume that merely adding the global pipe validates plain TypeScript interfaces.
- Add rate limiting for authentication, OTP, public enquiry and other abuse-sensitive endpoints.
- Configure proxy/trust-proxy behaviour carefully; do not trust arbitrary forwarded IP headers.
- Ensure webhook routes have suitable limits and signature checks without blocking legitimate provider retries.
- Add tests for invalid payloads, unknown fields and rate-limit behaviour.

#### SEC-05: CORS and WebSocket origins
- Replace permissive default CORS with an explicit environment-based allow-list for known web origins.
- Reject unknown origins where browser CORS applies.
- Review whether Socket.IO remains needed after ADR-001. Do not leave an unnecessary public dispatch gateway enabled.
- If a socket endpoint remains for another approved use, restrict origins and authenticate/authorize connections.
- Add configuration tests for allowed and rejected origins.

#### SEC-06: HTTP security and TLS boundary
- Review `nginx/conf.d/default.conf`, Compose and NestJS security headers.
- Add appropriate baseline security headers.
- Document TLS termination topology, redirect behaviour and trusted proxy assumptions.
- Do not hardcode certificates or claim HTTPS is active without a real certificate/deployment validation.
- Avoid blindly enabling an inflexible CSP that breaks the current app; introduce a tested policy.

#### SEC-07: Tenant/resource ownership
- Inventory authenticated routes that read or mutate business-owned resources.
- Add backend resource-level authorization. A valid JWT alone is not enough.
- Resolve owner/staff membership and permission against the requested business profile.
- Prevent IDOR across hotels, taxis, partner data, enquiries, media and future business resources.
- Add tests where user A attempts to access or modify user B's resource.
- Do not build the complete partner-management domain in Phase 1; implement the reusable authorization foundation and protect existing relevant endpoints.

### Workstream 3 — KYC upload safety foundation

Reported evidence: partner KYC is simulated in client code with `setTimeout`, and selected files are not securely uploaded.

Required:
- Remove any UI claim that a timer constitutes real verification.
- Represent verification as explicit server-owned states such as `NOT_SUBMITTED`, `PENDING_REVIEW`, `CORRECTION_REQUIRED`, `VERIFIED`, `REJECTED`.
- If a secure private file-storage integration already exists, assess it. Otherwise, define an interface and configuration boundary; do not invent credentials or upload documents to public storage.
- Enforce file size, extension/MIME validation, safe filenames and private access controls if implementing upload in this phase.
- Ensure only authorized reviewers can access submitted documents.
- Log reviewer identity, decision, timestamp and reason.
- Do not mark any partner verified automatically.
- If full private storage cannot be safely implemented in this phase, disable the fake upload/verification success path and deliver the backend contract plus a documented blocked integration. Do not simulate success.

### Workstream 4 — Mobile build remediation

Phase 0 detailed compiler output recorded:
- `App.tsx`: import uses `apiService` but service exports `ApiService`.
- `App.tsx`: eight number-to-string prop assignment errors.
- `SideDrawer.tsx`, `PartnerDashboardScreen.tsx`, `TravelerLoginScreen.tsx`: import `API_BASE_URL`, while config exports `API_URL`.

Required:
- Re-run `npx tsc --noEmit` and capture the exact current error list.
- Fix root causes, not by adding broad `any`, disabling strict checks, or suppressing diagnostics.
- Confirm whether `ApiService` is a class, object or singleton and use the intended instance consistently.
- Correct numeric/string types based on the actual component contracts; do not stringify values blindly if they are meant to be numeric.
- Standardize the API URL export and update consumers consistently.
- Run TypeScript, lint (if configured), tests and Expo/React Native validation that is available.
- Do not upgrade Expo/React Native/TypeScript versions as a shortcut.

### Workstream 5 — Database consolidation design and safe first implementation

Use ADR-003 as the authority.

Required:
1. Inventory all Prisma schema files, generator blocks, datasource providers, generated-client paths, migration folders, seed scripts and runtime imports.
2. Produce a model/field/ID/foreign-key comparison matrix for:
   - `database/prisma/schema.prisma`
   - `services/api/prisma/schema.prisma`
   - `services/api/prisma/schema.postgres.prisma`
3. Identify which schema is used by actual API scripts/build/runtime today.
4. Recommend the canonical PostgreSQL schema at `database/prisma/schema.prisma`, with one Prisma Client generation/import boundary.
5. Define the target migration and test strategy, including PostGIS extension/version.
6. Preserve `database/dev.db` and existing migration history.
7. Do not run reset, drop, truncate, destructive seed or production migration commands.
8. Do not perform a blind integer-to-UUID conversion.
9. Do not migrate persistent data until a backup and restore test are documented.
10. If a safe schema change can be made without data loss, make only the smallest reversible preparation change and explain it. Otherwise, deliver the inventory, ADR implementation notes and migration plan for founder review.

Do not create all future partner tables in Phase 1.

### Workstream 6 — Local ride direct-directory transition foundation

Implement ADR-001 only to the extent necessary to remove dispatch from supported traveller journeys safely:
- Inventory all dispatch routes/events/screens and dependencies.
- Remove dispatch actions from traveller navigation and screens only after direct-contact alternatives are verified.
- Preserve directory list/detail endpoints and phone/WhatsApp profile actions.
- Prevent new public dispatch requests after the controlled cutover.
- Keep dispatch code/data quarantined until dependency and retention review is complete.
- Do not delete gateway/service/schema in this phase unless the dependency graph proves they are isolated and the removal is separately documented.
- Add tests that local ride discovery remains available and dispatch is not exposed in the supported traveller flow.

### Workstream 7 — Next.js runtime architecture validation only

ADR-002 is accepted as the target direction, but Phase 1 must validate implementation feasibility before switching runtime:
- Inspect exact Next.js 16.3.6 package and lockfile.
- Verify the supported request interception convention for this installed version (`middleware`, `proxy`, or other documented mechanism).
- Verify standalone output, server runtime, ISR/revalidation and app-router behaviour against version-matched documentation and installed types.
- Identify every static-export assumption (`output: 'export'`, `generateStaticParams`, export scripts, static hosting, Nginx paths).
- Produce a migration checklist and a minimal technical proof of concept only if it can be isolated and tested.
- Do not implement the complete mini-site system in Phase 1.
- Do not add custom domain functionality.
- Do not deploy or change live DNS/TLS.
- If runtime conversion would break existing deployment or cannot be tested safely, leave current production mode untouched and report the blocker.

## 4. Explicitly forbidden actions

- No production deployment.
- No Git push, force push, history rewrite or commit amend.
- No production database migration.
- No `prisma migrate reset`, database drop, truncate, destructive seed or deletion of `database/dev.db`.
- No bulk UUID conversion.
- No deleting modules merely because they are currently out of scope.
- No removing existing user work, untracked files or local assets.
- No mass formatting or unrelated refactoring.
- No dependency upgrades as a shortcut.
- No new paid services or cloud storage subscriptions without approval.
- No real payment credentials, private KYC files or secrets in source control.
- No customer hotel/taxi booking/payment feature.
- No local ride dispatch feature.
- No claim of successful Docker/runtime/TLS testing if it was not executed.

## 5. Engineering standards

- TypeScript strictness must not be weakened to make builds pass.
- Use existing architectural conventions unless a documented defect requires change.
- Keep controllers thin; put authorization/business rules in testable services/guards/policies.
- Use explicit DTOs and typed response contracts.
- Use structured, redacted logs; never log tokens, passwords, payment secrets or KYC document contents.
- Add regression tests for every security fix.
- Ensure errors do not leak secrets, stack traces or cross-tenant resource existence.
- Keep migrations and config environment-aware.
- Document every changed file and why it changed.
- Use small logical commits locally if the user workflow expects commits; do not push.

## 6. Required deliverables

Create `docs/phase-1/` and produce:

1. `01_PHASE_1_EXECUTIVE_SUMMARY.md`
2. `02_SECURITY_REMEDIATION_REPORT.md`
3. `03_MOBILE_BUILD_REMEDIATION_REPORT.md`
4. `04_DATABASE_CONSOLIDATION_AND_MIGRATION_PLAN.md`
5. `05_LOCAL_RIDE_DIRECT_DIRECTORY_CUTOVER_REPORT.md`
6. `06_NEXTJS_RUNTIME_VALIDATION_REPORT.md`
7. `07_TEST_AND_BUILD_RESULTS.md`
8. `08_FILE_LEVEL_CHANGE_REGISTER.md`
9. `09_RISKS_BLOCKERS_AND_UNVERIFIED_ITEMS.md`
10. `10_PHASE_1_EXIT_GATE.md`

The exit gate must show each acceptance criterion as PASS / FAIL / NOT RUN / BLOCKED with evidence, exact commands and exit codes. Include the current Git commit and working-tree state.

## 7. Required test matrix

Run what is available and report what is not:

- Backend unit tests.
- Backend production build.
- Web production build.
- Mobile `npx tsc --noEmit`.
- Relevant frontend lint/tests.
- Security guard/authorization tests.
- Tenant isolation/IDOR tests.
- DTO validation tests.
- CORS allow/deny tests.
- Rate-limit tests.
- Compose config validation if Docker is available.
- Prisma schema validation and client generation.
- Migration test against a disposable PostgreSQL database if available.
- No production tests that mutate data.

Do not report a test as passed merely because a build compiles. Clearly separate unit tests, static checks, integration tests and runtime tests.

## 8. Stop conditions

Stop and report rather than guessing if:
- The working tree contains user changes that would be affected.
- A security fix requires an unapproved auth redesign.
- A migration could destroy or orphan data.
- Next.js 16.3.6 behaviour cannot be verified.
- A required secret, cloud service or external credential is unavailable.
- A change would introduce customer booking/payment or ride-dispatch functionality.
- A baseline failure cannot be reproduced.
- The proposed implementation conflicts with the accepted ADRs.

## 9. Definition of Done

Phase 1 is complete only when:
- P0 security vulnerabilities in scope are fixed or explicitly blocked with compensating controls and evidence.
- Admin and tenant authorization are enforced server-side and covered by tests.
- Unsafe secret fallbacks and public DB/Redis exposure defaults are removed from production configuration.
- API validation, rate limiting and CORS restrictions are configured and tested.
- KYC no longer falsely reports simulated verification as real verification.
- Mobile TypeScript check passes without suppressions.
- PostgreSQL schema consolidation plan is evidence-based and non-destructive.
- Local ride traveller experience is directory/direct-contact only, with dispatch safely quarantined.
- Next.js runtime feasibility is documented against the installed version.
- All available tests/builds are reported accurately.
- All deliverables exist under `docs/phase-1/`.
- No forbidden action has occurred.

At the end, provide a concise summary of what changed, tests passed/failed/not run, remaining risks, and a recommendation: **Phase 1 COMPLETE**, **PARTIALLY COMPLETE**, or **BLOCKED**. Do not start Phase 2 automatically.
