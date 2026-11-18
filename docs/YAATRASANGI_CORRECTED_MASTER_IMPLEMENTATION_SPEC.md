# YaatraSangi — Corrected Master Implementation Specification

**Version:** 1.0  
**Prepared:** 18 November 2026  
**Audit baseline:** `Audit_Report.zip`, inspected repository commit `6cd501b170590ff67df16a6ba5f93d5dcfb5c628` on `main`  
**Purpose:** Corrected product, architecture, security and delivery specification to guide implementation in Google Antigravity.

> This document is the implementation authority for the next development stages. It incorporates the audit evidence and the confirmed YaatraSangi business rules. It does not claim that any proposed feature has already been implemented.

---

## 1. Product definition

YaatraSangi is a travel discovery, information and direct-connection platform. It helps travellers discover destinations and travel-related businesses, plan routes, view business profiles, and contact service providers directly.

YaatraSangi is **not** an online travel agency and does not operate customer hotel/taxi bookings or collect customer payments for those services.

### 1.1 Customer journey

1. Discover destinations and travel information.
2. Plan and optimize a multi-stop route.
3. Browse relevant partner listings for a selected city/area and radius.
4. View partner details and contact the partner through phone, WhatsApp or an optional enquiry form.
5. Negotiate, book, pay, cancel and fulfil the travel service directly with the partner, outside YaatraSangi.

An enquiry/lead is not a booking, reservation, inventory hold, payment or service confirmation.

### 1.2 Platform surfaces

- Public website: opens at the website home page.
- Android app: opens at its own mobile home screen.
- iOS app: opens at its own mobile home screen.
- Partner dashboard: authenticated business-management interface.
- Admin dashboard: restricted operational and moderation interface.
- Partner mini-websites: public business profile websites on unique subdomains.

Web and mobile may have different layouts and navigation, but should share domain rules, API contracts, validation schemas and reusable business logic where practical.

---

## 2. Confirmed business rules — mandatory acceptance criteria

### 2.1 Partner categories and charges

| Category | Commercial policy | Trial |
|---|---|---|
| Hotels / accommodation | Paid annual subscription | One six-month free trial per eligible verified business |
| Outstation taxi operators | Paid annual subscription | One six-month free trial per eligible verified business |
| Tour operators | Paid annual subscription | One six-month free trial per eligible verified business |
| Restaurants | Permanently free | No trial required |
| Local ride providers (local bike, auto-rickshaw, city cab only) | Permanently free | No trial required |

- No customer booking commission.
- No customer hotel/taxi booking payments through YaatraSangi.
- No forced subscription, listing fee or registration fee for permanently free categories.
- Paid category plans are annual only. Monthly subscription plans are out of scope.
- Six-month trial begins only after the eligible business has completed verification and account activation.
- A business must not receive repeated trials by creating duplicate profiles or changing owners. Enforce eligibility centrally and audit exceptions.
- If one business offers both local and outstation services, do not automatically infer free/paid treatment. Admin-controlled category profiles and entitlements must apply the correct rules independently.
- Annual plan prices are not finalized. Store plan prices and entitlements as admin-configurable data. Do not hardcode illustrative prices (e.g. ₹4,990 / ₹9,990 / ₹19,990) as approved commercial policy.
- Restaurants and local ride providers must remain free even if future paid placement or optional services are introduced; any such product requires separate explicit approval and clear opt-in.

### 2.2 Partner ownership and profiles

- One owner account can manage multiple business profiles.
- A business can have multiple locations.
- Individual local ride providers and fleet/business owners can register.
- Business owner identity and business profile are separate domain concepts.
- Staff memberships and permissions are scoped to a specific business profile.
- Subscription/trial state belongs to the eligible business/category profile, not simply to the owner account.
- Each approved business profile receives its own unique mini-website subdomain.
- Custom domains are a future phase, not initial launch scope.

### 2.3 Mini-site and content policy

- Partner dashboard and public mini-site are separate interfaces.
- Partner content is drafted and previewed before submission.
- Every public content change requires admin approval for the initial release.
- The currently published version remains live while edits await approval.
- Maintain revision history, reviewer identity, timestamps and rejection reasons.
- Admin verifies business identity/documents before activation and separately moderates public content.
- Business verification status, content publication status and subscription status are independent state machines.

### 2.4 Enquiries

- Guests may submit an enquiry without mandatory traveller account registration.
- Enquiries are leads only; never label them as confirmed bookings.
- Include anti-spam controls, rate limits, input validation, consent/privacy messaging and appropriate contact verification.
- Partners can view and update lead statuses in their dashboard.
- Do not add lead-based fees in the initial release.

### 2.5 Local ride feature boundary

The confirmed permanently free local ride category covers local bike, auto-rickshaw and city cab service providers. This does **not** by itself authorize YaatraSangi to run dispatch, bidding, live matching, driver allocation, trip tracking, emergency/ambulance operations or payment settlement. Existing ride WebSocket functionality must be isolated and reviewed; retain only if it is explicitly approved as a direct-contact discovery/communication feature. Do not silently expand the product into a ride-hailing operator.

---

## 3. Audit baseline and confidence

The submitted Antigravity audit reports:

- Repository branch `main`, commit `6cd501b170590ff67df16a6ba5f93d5dcfb5c628`.
- Backend tests: 20 test files / 41 tests passed.
- Backend production build: passed.
- Website build: passed and generated 42 routes.
- Mobile TypeScript check: failed with 12 errors.
- Docker Compose runtime/config validation: not run because Docker CLI was unavailable on the audit workstation.
- Live PostGIS migrations, live Razorpay transactions, physical device packaging, wildcard DNS/SSL and high-concurrency load tests: not verified.

The audit score of 4.8/10 is a directional assessment, not an independently reproduced benchmark. The audit report is evidence supplied by the repository audit; this specification does not claim independent execution of those checks.

**Mandatory first check:** Antigravity must confirm the current working tree, branch and HEAD commit before making any changes. If it differs from the audited commit, re-check relevant files and update the plan before applying changes.

---

## 4. Existing capabilities to preserve where sound

The audit identifies these as potentially valuable assets; preservation is conditional on dependency review and regression tests:

- Route optimization using Greedy Nearest Neighbor + 2-Opt.
- OSRM routing provider and Haversine fallback.
- Destination and map UI components.
- Hotel/location radius search where it supports discovery rather than booking.
- NestJS modular backend and Prisma data access.
- JWT/bcrypt authentication foundations and role guards, after security review.
- Razorpay provider/signature/webhook infrastructure only for partner subscription billing, after review.
- Idempotency infrastructure, after confirming persistence and distributed behaviour.
- Dockerfiles, Nginx reverse proxy baseline and GitHub Actions CI.
- Existing web/mobile UI components that can be aligned with the direct-connection model.

Do not rewrite or delete working modules merely to make the architecture look cleaner. Prefer incremental refactoring with tests and documented migration steps.

---

## 5. Critical corrections to the audit's proposed implementation

### 5.1 Static export versus dynamic subdomain routing

The audit reports that the website currently uses Next.js static export and also proposes Next.js middleware for host-based dynamic subdomain routing. These are not a drop-in combination in the usual Next.js deployment model.

Before implementing subdomains, conduct a short architecture decision review comparing:

**Option A — Next.js server runtime:** deploy the website with a supported server runtime; resolve the request host on the server; fetch the published business profile; render the correct template. Assess hosting cost, operational complexity, caching and security.

**Option B — Separate mini-site rendering service:** retain the current statically exported traveller website and build a dedicated dynamic mini-site service behind Nginx. Resolve wildcard hostnames at ingress and pass a validated tenant/subdomain identifier to the service.

**Option C — Build-time/static tenant pages:** only consider if the product can accept rebuild/revalidation limitations and the approach supports partner publishing requirements. Do not assume this is suitable.

Record the selected option in an Architecture Decision Record (ADR) before implementation. Do not claim that adding `middleware.ts` alone solves the issue.

### 5.2 Admin security

- A browser-side `localStorage` flag is never authorization.
- Remove client-side synthetic admin identity and hardcoded admin email checks.
- Enforce authentication, role checks and resource-level authorization in the backend for every admin endpoint.
- Use a secure session/token design appropriate to the web deployment; document cookie flags, CSRF strategy where applicable, token lifetime, refresh/revocation and logout behaviour.
- A hidden or protected frontend route is only a user-interface control, not the security boundary.
- Add tests proving anonymous users, normal partners and one tenant cannot access admin or another tenant's data.

### 5.3 KYC / business verification

- Replace timer-based or simulated verification with real document upload and persistent review records.
- Store documents in private object storage (provider configurable); never expose raw KYC documents through public profile URLs.
- Use short-lived authorized access for reviewers, file size/type validation, malware scanning where available, access logs and retention/deletion policy.
- Only an authorized admin action may transition a business to verified.
- Verification and content approval are separate workflows.

### 5.4 Subscription payments

Razorpay can be considered for partner subscription fees only. Do not connect it to customer hotel/taxi enquiries or bookings.

A complete subscription design must include durable payment/order records, server-side signature verification, webhook signature verification, idempotent webhook processing, duplicate/out-of-order event handling, invoice/receipt records, renewal/expiry policy, reconciliation and entitlement transitions. Do not equate successful checkout redirect with verified payment.

Do not repurpose booking expiry code as subscription logic without a separate service and tests. Reuse only generic scheduling patterns if suitable.

### 5.5 Existing booking and ride modules

- Remove customer booking/hold/checkout actions from customer-facing journeys.
- Do not delete booking modules immediately. Trace imports, API consumers, tests, migrations and data dependencies first.
- Classify each booking/payment file as reusable, redesign, remove from customer flow, repurpose for subscription, or requires business decision.
- The audit's suggestion that local ride WebSocket dispatch is automatically aligned is not accepted as a confirmed product decision. Keep it isolated pending explicit scope approval.

---

## 6. Target logical domain model

This is a logical target model, not a mandate to create one table per noun. Inspect existing schema, relationships and migration history before designing the physical schema.

### Identity and access
- `User`
- `OwnerAccount` (or equivalent owner identity)
- `BusinessMembership` / `OwnerMembership` (owner or staff membership with scoped role)
- `Role` / `Permission` or equivalent RBAC model

### Business and category
- `BusinessProfile`
- `PartnerCategory`
- `BusinessCategoryProfile` (if a business has multiple category-specific service profiles)
- `BusinessLocation`
- `VerificationCase` / `VerificationDocument`

### Mini-site and moderation
- `MiniWebsite`
- `ContentRevision`
- `ContentReview` / `ContentApproval`
- `PublishedContent` or a stable published-version pointer
- `MediaAsset`

### Subscription
- `SubscriptionPlan`
- `Subscription` / `BusinessEntitlement`
- `TrialGrant` (unique eligibility enforcement)
- `PaymentOrder`
- `PaymentTransaction`
- `PaymentWebhookEvent`
- `Invoice` / receipt record where required

### Customer leads
- `CustomerEnquiry`
- `EnquiryStatusHistory`
- `EnquiryContactVerification` where applicable

### Governance
- `AuditLog`
- `Notification`

Use PostgreSQL/PostGIS for production geography if confirmed by the current deployment architecture. Add tenant ownership constraints and indexes. Ensure schema parity between development and production Prisma schemas, or document and eliminate unnecessary duplication.

### State separation
Do not use one overloaded `status` column for everything. Model at least these independent lifecycles:

- Business verification: `REGISTERED`, `CONTACT_VERIFIED`, `VERIFICATION_PENDING`, `CORRECTION_REQUIRED`, `VERIFIED`, `SUSPENDED`, `REJECTED`.
- Profile completion: `INCOMPLETE`, `READY_FOR_REVIEW`.
- Content: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `PUBLISHED` (choose exact transitions in the state machine).
- Subscription: `NOT_REQUIRED`, `TRIAL_ACTIVE`, `ACTIVE`, `PAYMENT_DUE`, `GRACE_PERIOD`, `EXPIRED`, `CANCELLED`, `SUSPENDED` (final states and transitions require a policy ADR).

For exempt categories, `NOT_REQUIRED` must not accidentally disable the business profile or public listing.

---

## 7. API and module boundaries

The following are candidate boundaries, not pre-existing verified endpoints. Align names and versioning with current conventions.

- Authentication and session management.
- Owner accounts and memberships.
- Business profiles and category profiles.
- Business locations.
- Verification and private documents.
- Mini-sites, subdomain resolution and public published content.
- Drafts, revisions and admin approvals.
- Subscription plans, trials, entitlements and partner billing.
- Public enquiries and partner lead management.
- Admin operations and audit logs.
- Destinations, route planning and discovery search.
- Notifications and media management.

Candidate API patterns:

- `/auth/*`
- `/owners/me`, `/owners/me/businesses`
- `/businesses`, `/businesses/:businessId`
- `/businesses/:businessId/locations`
- `/businesses/:businessId/verification`
- `/businesses/:businessId/website`
- `/businesses/:businessId/content/drafts`
- `/admin/businesses/:businessId/verification/*`
- `/admin/content-reviews/:reviewId/*`
- `/businesses/:businessId/subscription`
- `/public/businesses/:slug/enquiries`
- `/businesses/:businessId/enquiries`

Use consistent response/error contracts, pagination, filtering, DTO validation, OpenAPI documentation and authorization guards. Never trust a `businessId`, `ownerId`, role or category supplied by the browser without resolving access from the authenticated principal.

---

## 8. Target user journeys

### 8.1 Partner onboarding

1. Register owner account.
2. Verify contact method.
3. Create one or more business profiles.
4. Select category/category profiles.
5. Complete category-specific details and locations.
6. Upload required private verification documents.
7. Submit for admin verification.
8. Admin approves, requests correction or rejects with reason.
9. On verification and activation, grant one six-month trial to eligible paid category profile; permanently free categories receive `NOT_REQUIRED` entitlement.
10. Partner completes public profile and mini-site draft.
11. Preview and submit content for review.
12. Admin approves; publish to unique subdomain.

### 8.2 Content update

1. Partner edits a draft revision.
2. Current published version remains public.
3. Partner submits revision.
4. Admin approves or rejects with reason.
5. Approved revision becomes published atomically.
6. Record who changed/reviewed/published and when.

### 8.3 Customer enquiry

1. Customer opens listing or mini-site.
2. Customer taps call/WhatsApp or submits enquiry form.
3. Form validates and applies anti-spam controls.
4. Enquiry is stored and routed to the correct business profile.
5. Partner sees it in lead inbox and contacts the customer directly.
6. YaatraSangi does not confirm a booking, take customer payment or guarantee fulfilment.

### 8.4 Paid partner subscription

1. Eligible verified business receives one six-month trial.
2. Notify before trial expiry.
3. Partner selects a configurable annual plan.
4. Backend creates a partner subscription payment order.
5. Payment provider response and webhook are verified server-side.
6. Idempotent processing updates subscription and entitlement.
7. Renewal, grace period and downgrade behaviour must follow a separately approved policy.

**Unfinalized policy:** exact grace period, renewal timing, cancellation/refund policy, plan upgrade/downgrade proration and post-expiry visibility. Preserve data and drafts by default; never delete partner content solely because a subscription expires. Obtain product-owner approval before enabling automatic charge/renewal.

---

## 9. Security and privacy baseline

Before any public production launch:

- Backend-enforced RBAC and tenant-level authorization on every protected operation.
- No client-side authorization flags or hardcoded admin credentials.
- Global DTO validation and safe serialization.
- Rate limiting on login, OTP, enquiry, upload and other abuse-prone endpoints.
- CORS allowlist, secure headers, HTTPS, cookie/token security and CSRF protections where relevant.
- Secrets only through deployment secrets/environment injection; no weak fallback production secrets.
- Database and Redis must not be publicly exposed; bind only to private/internal network unless a documented secure access path is required.
- Encrypt transport; protect sensitive data at rest according to hosting capabilities.
- Private KYC storage and access audit trail.
- Webhook signature verification and idempotent event handling.
- Audit logs for admin actions, verification decisions, subscription changes and content publishing.
- Backups with tested restoration procedure.
- Dependency, container and secret scanning in CI.
- Privacy notice, consent, data retention and deletion workflows appropriate to Indian legal requirements; obtain qualified legal review before launch.

---

## 10. Developer productivity framework

Build reusable capabilities inside the existing monorepo rather than creating a separate generic framework prematurely. Audit current packages and tooling first; keep Turborepo if it remains suitable.

Candidate structure (adapt to existing conventions):

```text
packages/
  core/
  authentication/
  permissions/
  business-domain/
  validation/
  api-client/
  shared-types/
  ui/
  maps/
  notifications/
  analytics/
  testing/
tools/
  cli/
  generators/
  scripts/
  templates/
```

Potential generators: NestJS module/controller/service/DTO/test scaffolding; web feature/page; mobile screen; shared schema/type; migration/seed; API client; documentation and test fixtures.

Framework acceptance criteria:
- generated modules follow existing conventions and compile;
- generated endpoints include DTO validation and authorization placeholders;
- generated features include tests and documentation stubs;
- shared API contracts are type-safe;
- lint, format, typecheck, tests and build can run consistently;
- no generator silently overwrites existing user code;
- templates are versioned and have tests.

Do not build a large CLI before the core architecture is stable. Start with shared contracts, validation, test utilities and a small number of proven generators.

---

## 11. Production architecture decision points

Create ADRs and get owner approval for:

1. Dynamic subdomain rendering approach (Next.js server runtime vs separate mini-site service).
2. Authentication/session strategy across web, mobile, partner and admin surfaces.
3. Database schema and Prisma dev/production parity.
4. Private media/KYC storage provider and retention policy.
5. Subscription provider integration and webhook architecture.
6. Subscription grace/expiry/renewal/cancellation policy.
7. Whether any local ride dispatch/WebSocket workflow remains in product scope.
8. Hosting, wildcard DNS, TLS certificate and deployment strategy.

Do not block safe groundwork (repo baseline, security fixes, mobile compile fixes) while ADRs are being prepared, but do not implement irreversible architecture choices without documenting them.

---

## 12. Phased delivery plan and exit gates

### Phase 0 — Repository baseline and safety
- Confirm repo path, branch, HEAD, dirty files, remotes and lockfiles.
- Create/confirm a safe working branch and backup/commit strategy.
- Re-run baseline checks where tooling permits and save exact logs.
- Map all booking/payment/ride/vendor/admin/onboarding dependencies.
- Produce ADR for mini-site runtime options; no feature implementation yet.

**Exit gate:** clean baseline report, no uncommitted user work overwritten, dependency map, confirmed current commit, architecture options documented.

### Phase 1 — P0 security and build stability
- Remove localStorage-based admin trust and hardcoded admin identity.
- Enforce backend admin RBAC and tenant resource authorization.
- Replace fake KYC verification path with disabled-safe pending workflow until real private upload/review is ready; never display false verification success.
- Add DTO validation and rate limiting in staged, tested changes.
- Fix all 12 reported mobile TypeScript errors based on current source, not blind alias additions.
- Fix production secret fallbacks and internal-only DB/cache exposure.

**Exit gate:** security tests pass; mobile typecheck passes; backend/web builds and existing tests remain green; no fake verification path remains.

### Phase 2 — Domain model and partner foundation
- Finalize logical/physical data model and migration plan.
- Implement owner memberships, business profiles, categories, locations and scoped staff permissions.
- Implement verification lifecycle and admin audit trail.
- Add tenant-isolation tests.

**Exit gate:** partner can create/manage multiple profiles and locations; cross-tenant access tests fail safely; migrations are reversible/operationally documented.

### Phase 3 — Partner onboarding and dashboards
- Category-specific forms and validation.
- Private document storage and real verification workflow.
- Partner dashboard and admin review queues.
- Role-scoped staff management.

**Exit gate:** end-to-end onboarding and admin verification tested.

### Phase 4 — Discovery and enquiries
- Direct-contact listings and category-specific profile detail pages.
- Search/filter/radius support.
- Guest enquiry capture, anti-spam and partner lead inbox.
- Remove customer booking/checkout actions from web and mobile journeys.

**Exit gate:** customer can discover/contact/enquire; no customer booking/payment transaction is exposed.

### Phase 5 — Mini-websites and moderation
- Implement selected subdomain architecture.
- Wildcard DNS/Nginx/TLS deployment plan.
- Category templates, draft/preview/revision and admin approval.
- Published content cache invalidation and tenant isolation.

**Exit gate:** two or more test businesses resolve to correct isolated subdomains; drafts are never public; published revision changes only after approval.

### Phase 6 — Subscription and entitlements
- Configurable annual plans for paid categories.
- Six-month trial and one-trial eligibility enforcement.
- Permanent exemption for restaurant/local ride profiles.
- Partner subscription payment records and verified webhooks.
- Admin controls, invoices/receipts and expiry notifications.

**Exit gate:** test matrix covers all categories, trial eligibility, duplicate payments/webhooks, expiry and entitlement transitions.

### Phase 7 — Traveller website and mobile completion
- Shared API contracts/business rules.
- Separate web/mobile UI and navigation.
- Accessibility, localization readiness, analytics consent and crash reporting.
- Web/mobile unit and end-to-end coverage.

**Exit gate:** production builds and core user journeys pass on supported browsers/devices; Android/iOS packaging pipeline documented.

### Phase 8 — Production readiness and launch
- HTTPS, wildcard DNS, secrets management, private networking.
- Backups and tested restore.
- Monitoring, logging, alerting and incident runbooks.
- Load/security testing, dependency/container scanning.
- Privacy/legal review, support workflows, app store preparation.
- Staged rollout and rollback plan.

**Exit gate:** signed production checklist, tested rollback/restore, no open P0/P1 issues, owner approval.

---

## 13. Definition of done for every implementation task

Every task must include:
1. Exact scope and files to inspect/change.
2. Business rule(s) it satisfies.
3. Migration and backwards-compatibility impact.
4. Security and tenant-isolation implications.
5. Tests added/updated and exact commands executed.
6. Build/typecheck results.
7. Screenshots or reproducible steps for UI changes where useful.
8. Risks, limitations and follow-up work.
9. No unrelated rewrites or deletion of existing code.

Antigravity must report **PASS / FAIL / NOT RUN** honestly. Never claim a command passed if it was not executed.

---

## 14. Immediate next action

Start with **Phase 0 only** using the companion prompt `ANTIGRAVITY_PHASE_0_PROMPT.md`. Do not start implementing Phases 1–8 until the Phase 0 report is reviewed and the relevant architecture decisions are recorded.
