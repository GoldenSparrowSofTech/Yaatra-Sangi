# Phase 0: Open Decisions, Strategic Risks & Product Rules Alignment

**Generated:** 2026-11-18  
**Author:** Software Architecture & Security Engineering Review  
**Project:** YaatraSangi Monorepo  
**Status:** AWAITING FOUNDER / PRODUCT OWNER SIGN-OFF

---

## 1. Product Rules Alignment Audit

The repository implementation was strictly audited against the authoritative product specification in `YAATRASANGI_CORRECTED_MASTER_IMPLEMENTATION_SPEC.md`.

| Authoritative Product Rule | Current Implementation Status | Gap / Action Required |
| :--- | :---: | :--- |
| **Discovery mediator only; NOT an OTA** | **VIOLATED IN CODE** | Backend contains full room hold, booking status, 10% platform commission, and 18% GST calculation engines. Must quarantine and remove from customer flow. |
| **No customer payments or checkout** | **VIOLATED IN CODE** | Razorpay is currently integrated with `bookingId` and client-supplied payment amounts. Must decouple and repurpose strictly for partner subscriptions. |
| **Direct contact (Phone/WhatsApp) without mandatory login** | **ALIGNED ON WEB; VIOLATED ON MOBILE** | Web detail pages already render WhatsApp and Phone buttons. Mobile screens (`HotelsScreen`, `CabsScreen`) still invoke `ApiService.createBookingHold` ("Hold & Pay"). |
| **Paid categories: Hotel, Outstation Taxi, Tour** | **MISALIGNED IN PARTNER TEXT** | Partner page lists charges for Local Rides and Restaurants. Must update UI text and schema. |
| **Permanently FREE: Restaurant & Local Ride Providers** | **MISALIGNED IN PARTNER TEXT** | Partner UI lists "Base fee ₹XYZ" for Restaurants and "1st Bike: ₹XYZ" for Local Rides. Must be marked 100% permanently free. |
| **One 6-month trial after verification** | **MISALIGNED IN PARTNER TEXT** | Partner UI displays "3 Months Free Trial Active!". Must be corrected to 6 months. |
| **Annual plans only; NO monthly plans** | **UNIMPLEMENTED** | Plan intervals are not yet codified in backend models. |
| **One owner -> Multiple business profiles -> Multiple locations** | **MISSING IN SCHEMA** | Current schema links user directly to individual assets (`Hotel.ownerId`, `TaxiCompany.ownerId`). Lacks `BusinessProfile` and `BusinessLocation` hierarchy. |
| **One approved business profile = One subdomain mini-site** | **UNIMPLEMENTED** | Routing currently uses path slugs (`/hotel/[slug]`). No subdomain routing logic exists. |
| **Dual-state content (Live stays live during edit review)** | **UNIMPLEMENTED** | Schema has single `status` column (`DRAFT`, `APPROVED`). Editing overwrites live data immediately. |
| **Guest enquiries without mandatory login** | **UNIMPLEMENTED** | Enquiry persistence model not yet created. |
| **Local ride dispatch / bidding / matching** | **BUSINESS DECISION REQUIRED** | Monorepo contains functional Socket.io bidding and dispatch engine (`LocalRidesGateway`). Founder decision required. |

---

## 2. Key Decisions Requiring Founder / Owner Approval

### Decision 1: Fate of Real-Time Local Ride Dispatch Engine
- **Current State:** `LocalRidesGateway` (NestJS WebSocket gateway) and `apps/traveller-mobile/src/screens/LocalRidesScreen.tsx` implement a live ride-hailing loop (passenger requests ride, nearby online drivers receive push event, drivers submit bids, passenger accepts, OTP verification).
- **Core Product Dilemma:** The corrected master spec emphasizes YaatraSangi as a direct-connection directory mediator (calling/WhatsApping drivers directly), not an on-demand dispatch aggregator (like Uber/Ola).
- **Options for Founder:**
  1. **Option A (Decommission Dispatch):** Completely remove WebSocket dispatch and bidding. Treat auto-rickshaws, bike taxis, and city cabs purely as directory listings with direct "Call Driver" and "WhatsApp" buttons (consistent with hotels and restaurants).
  2. **Option B (Retain Dispatch as Value-Add Feature):** Keep WebSocket dispatch for local rides as a free platform utility for local drivers and passengers.
- **Architectural Impact:** Option A drastically simplifies backend complexity, eliminates in-memory driver state, and removes real-time socket infrastructure. Option B requires adding Redis pub/sub, geospatial indexing, and driver location tracking.

---

### Decision 2: Subscription Pricing, Grace Periods & Expiry Behavior
- **Current State:** Code contains placeholder text `"₹XYZ"`. The schema contains `Subscription` with `trialEndsAt` and `currentPeriodEnd`, but no pricing tiers, grace periods, or auto-renewal rules.
- **Questions for Founder:**
  1. What are the exact annual subscription prices for:
     - Independent Hotel / Resort: ₹_________ / year
     - Outstation Taxi Operator: ₹_________ / year
     - Tour Operator: ₹_________ / year
  2. Multi-location / Multi-asset pricing: If a hotel owner has 2 locations or an operator has 5 cabs, does each additional asset require an add-on fee or a separate subscription?
  3. Grace Period: When the 6-month trial or 1-year paid plan expires, how many days grace period before the mini-site and public listing are hidden? (e.g. 7 days vs 14 days).

---

### Decision 3: Database Schema Duality Reconciliation
- **Current State:** Two conflicting Prisma schemas exist in the repository:
  - `database/prisma/schema.prisma` (UUID string IDs, `HotelBooking`, `TaxiCompany`, `Subscription`)
  - `services/api/prisma/schema.prisma` (Int autoincrement IDs, `Booking`, `Ride`, `PlaceToVisit`)
- **Required Approval:** We recommend standardizing on a single unified PostgreSQL schema located in `database/prisma/schema.prisma`, migrating all entity IDs to UUID string identifiers, and generating Prisma client output to both workspaces.

---

### Decision 4: Mini-Site Architecture Adoption
- **Current State:** `apps/traveller-web` uses Next.js static export (`output: 'export'`), which is incompatible with dynamic wildcard subdomains.
- **Required Approval:** Approve ADR Draft Recommendation (Option 1) to switch `traveller-web` to Next.js Node.js `standalone` server runtime with Edge/Server Middleware subdomain routing and ISR caching.

---

## 3. High-Priority Engineering Risks & Mitigations

| Risk ID | Risk Description | Severity | Likelihood | Mitigation Strategy |
| :---: | :--- | :---: | :---: | :--- |
| **RSK-01** | **Mobile TypeScript Compilation Failure Blocks CI** | High | Confirmed (100%) | Fix 11 explicit type errors in `App.tsx`, `SideDrawer.tsx`, `PartnerDashboardScreen.tsx`, and `TravelerLoginScreen.tsx` in Phase 1 before merging any PRs. |
| **RSK-02** | **Production Port Exposure of Postgres and Redis** | Critical | High | Bind container ports strictly to `127.0.0.1` or eliminate host port mappings entirely in `docker-compose.prod.yml`, routing exclusively through Docker internal bridge network. |
| **RSK-03** | **Hardcoded Fallback JWT Secrets Compromise Auth** | Critical | High | Remove fallback strings (`|| 'super-secret-key'`). Introduce application startup assertion that terminates boot if required environment secrets are absent. |
| **RSK-04** | **Schema Mismatch Runtime Crashes** | High | High | Reconcile the duplicate schemas before creating new database migrations. Ensure all foreign keys, UUID formats, and model names match across backend controllers. |
| **RSK-05** | **Simulated KYC Document Verification Liability** | High | High | Implement real multipart file upload to private object storage with admin approval queue before allowing partner listings to publish. |
