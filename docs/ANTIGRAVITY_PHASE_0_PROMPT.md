# Google Antigravity Prompt — YaatraSangi Phase 0: Safe Repository Baseline

You are acting as a senior software architect, security engineer and technical program lead for YaatraSangi.

Read and follow `YAATRASANGI_CORRECTED_MASTER_IMPLEMENTATION_SPEC.md` as the authoritative product and implementation specification. The full audit reports are in `docs/audit/` if available. This task is **Phase 0 only**.

## Non-negotiable safety rules

1. Phase 0 is READ-ONLY. Do not edit, create, delete, rename, format or move application source files, configuration files, migrations, package manifests, lockfiles or deployment files.
2. Do not install, upgrade or remove dependencies.
3. Do not run database migrations, seed commands, destructive cleanup, deployments, pushes or production operations.
4. Do not overwrite uncommitted user work. Do not reset, checkout over, stash-pop or clean the working tree.
5. Do not print secrets, tokens, private keys, passwords, personal data or full environment-file contents. Redact values; report only variable names and whether configured/missing where safe.
6. Do not assume the repository still matches the audited commit. Verify the current state.
7. Do not implement any feature in this phase.

## Tasks

### A. Establish repository identity and working-tree safety

Report:
- repository root;
- current branch;
- current HEAD commit hash;
- whether HEAD matches audit commit `6cd501b170590ff67df16a6ba5f93d5dcfb5c628`;
- `git status --short` summary (do not expose secret contents);
- remotes (redact embedded credentials if any);
- package manager and lockfiles;
- Node/package manager versions if already available without installing anything.

If there are uncommitted changes, identify affected paths and mark them **USER WORK — DO NOT OVERWRITE**. Do not attempt to clean them.

### B. Reproduce baseline checks safely

Only run commands supported by the current repository and local environment. Record exact commands, exit codes, concise output and duration where available:
- backend tests;
- backend build;
- website build;
- mobile TypeScript check;
- Docker Compose config validation only if Docker is installed.

Do not install missing tools. Mark unavailable checks `NOT RUN` with the reason. Do not claim previous audit outputs are current results.

### C. Map high-risk feature dependencies

Trace references and consumers for:
- bookings, room holds, booking expiry, commission/GST calculations;
- customer payment/order endpoints and Razorpay provider/webhooks;
- idempotency implementation and storage backend;
- local ride WebSocket/gateway/dispatch/bidding;
- vendor/partner modules;
- admin dashboard and all admin API routes/guards;
- partner onboarding/KYC/document handling;
- current partner pricing/trial text and category rules;
- hotel/taxi/restaurant/tour/local ride public pages and mobile screens;
- mini-site slug/path routing and any host/subdomain handling;
- database schema(s), migrations and seed data;
- Nginx, Docker Compose, TLS, environment variable references and CI.

For every area, classify files as:
- KEEP / REUSE;
- MODIFY / REDESIGN;
- REMOVE FROM CUSTOMER FLOW (do not delete yet);
- REPURPOSE FOR PARTNER SUBSCRIPTIONS (only after detailed review);
- BUSINESS DECISION REQUIRED.

Provide file paths, symbols/routes, and line references where available. Explain dependency links before suggesting removal.

### D. Security baseline review

Specifically verify, from source:
- whether admin trust is based on localStorage/client-side flags or hardcoded emails;
- which backend admin routes exist and which guards protect each;
- whether resource-level tenant ownership checks exist;
- whether global DTO validation and rate limiting are enabled;
- CORS and security headers;
- production secrets/fallback values (never print values);
- DB/Redis host port bindings;
- KYC upload storage, access control and whether any simulated verification remains;
- webhook signature verification and idempotency behaviour.

Do not make changes. Separate confirmed findings from concerns requiring runtime verification.

### E. Mini-site architecture decision analysis

The audit reports Next.js static export and proposes middleware-based wildcard subdomain routing. Do not assume these are compatible.

Compare at least:
1. Next.js server runtime for the traveller site and mini-sites;
2. a separate dynamic mini-site rendering service while retaining the current static traveller site;
3. static tenant pages, if viable.

For each option compare: compatibility with current app, deployment complexity, wildcard DNS/Nginx/TLS, content approval/publish behaviour, caching/invalidation, SEO, security/tenant isolation, operational cost and future custom domains.

Recommend one option with explicit assumptions and trade-offs, but do not implement it. Create an ADR draft in the Phase 0 report only.

### F. Confirm product rules are reflected in the code map

Use these rules exactly:
- YaatraSangi is a discovery/direct-connection mediator, not an OTA.
- No customer hotel/taxi booking, room holds, booking confirmation, customer checkout/payment, booking commission, refund or fulfilment workflow.
- Customer bookings/payments are handled directly between customer and partner outside YaatraSangi.
- Payment gateway is only for partner subscriptions.
- Hotels, outstation taxi operators and tour operators: annual paid categories, one six-month trial after verification/activation.
- Restaurants and local bike/auto-rickshaw/city-cab providers: permanently free.
- No monthly plans; annual plans only for paid categories.
- One owner may manage multiple business profiles; profiles may have multiple locations; staff access is business-scoped.
- One approved business profile gets one subdomain mini-site; custom domains later.
- Admin verification and public content approval are required; published content remains live while edits await review.
- Guest enquiries are allowed without mandatory traveller login; enquiry is not a booking.
- Local ride dispatch/bidding/live matching is NOT automatically in scope; mark existing dispatch functionality `BUSINESS DECISION REQUIRED`.
- Plan prices, grace period, expiry behaviour, renewals and cancellation/refund policy are not finalized. Do not hardcode assumptions.

### G. Produce Phase 0 outputs

Create only new Markdown report files under `docs/phase-0/` (create the directory if absent). Do not edit existing docs. Required files:

1. `PHASE_0_REPOSITORY_BASELINE.md`
2. `PHASE_0_BUILD_TEST_RESULTS.md`
3. `PHASE_0_DEPENDENCY_AND_FILE_MAP.md`
4. `PHASE_0_SECURITY_BASELINE.md`
5. `PHASE_0_MINI_SITE_ARCHITECTURE_ADR_DRAFT.md`
6. `PHASE_0_OPEN_DECISIONS_AND_RISKS.md`
7. `PHASE_0_EXIT_GATE.md`

The exit gate must clearly state PASS / FAIL / BLOCKED for:
- repository identity and working-tree safety;
- baseline test/build reproduction;
- booking/payment/ride dependency mapping;
- admin/KYC/tenant security review;
- static-export/subdomain architecture decision draft;
- product-rule alignment map.

A PASS is allowed only when evidence is present. Use NOT VERIFIED / NOT RUN where appropriate. Include exact commands and results. Do not invent line numbers, tests, endpoints, environment settings or successful checks.

## Final response format

Summarize:
1. current branch and commit, and whether it matches audit baseline;
2. any uncommitted user work that must be protected (paths only);
3. reproduced test/build results;
4. confirmed P0/P1 issues;
5. mini-site architecture options and recommended ADR draft;
6. open decisions requiring owner approval;
7. Phase 0 exit-gate result;
8. exact paths of all generated reports.

Stop after Phase 0. Do not start Phase 1 automatically. The reports will be reviewed before implementation begins.
