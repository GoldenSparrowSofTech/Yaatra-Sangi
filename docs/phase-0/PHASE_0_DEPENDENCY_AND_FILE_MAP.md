# Phase 0: High-Risk Feature Dependency & Codebase Classification Map

**Generated:** 2026-11-18  
**Author:** Software Architecture & Security Engineering Review  
**Project:** YaatraSangi Monorepo  
**Classification Categories:**
- **KEEP / REUSE**: Architectural components, core models, generic utilities aligned with discovery specification.
- **MODIFY / REDESIGN**: Code requiring refactoring to align with directory, subscription, and multi-location domain rules.
- **REMOVE FROM CUSTOMER FLOW**: Customer booking, OTA room holds, customer payment checkout, booking commission routines (quarantined/decoupled; not deleted immediately).
- **REPURPOSE FOR PARTNER SUBSCRIPTIONS**: Payment and order infrastructure shifted exclusively to annual partner subscriptions.
- **BUSINESS DECISION REQUIRED**: Features requiring explicit founder/product owner authorization before removal or preservation.

---

## 1. Bookings, Room Holds, Booking Expiry, Commission & Tax Calculations

### Dependency Analysis
The codebase currently contains a complete Over-The-Air (OTA) hotel/cab/package reservation engine. The customer creates a 15-minute temporary reservation hold, a 10% platform commission fee and 18% GST are calculated, and an expiration cron monitors and cancels unpaid holds.
- **Consumers:**
  - `apps/traveller-mobile/src/screens/HotelsScreen.tsx` (lines 54–61)
  - `apps/traveller-mobile/src/screens/CabsScreen.tsx` (lines 64–70)
  - `services/api/src/bookings/bookings.controller.ts`
  - `services/api/src/bookings/bookings.service.ts`
  - `services/api/src/bookings/services/booking-expiry.service.ts`

### File Classification
| File Path | Symbols / Routes | Classification | Justification & Dependencies |
| :--- | :--- | :--- | :--- |
| `services/api/src/bookings/bookings.controller.ts` | `POST /bookings/hold`, `POST /bookings/confirm`, `GET /bookings`, `GET /bookings/:id`, `POST /bookings/cleanup-expired` | **REMOVE FROM CUSTOMER FLOW** | Implements customer checkout, room hold, and confirmation. Violates Rule: "YaatraSangi is a discovery/direct-connection mediator, not an OTA." |
| `services/api/src/bookings/bookings.service.ts` | `createHold`, `confirmBooking`, `HOLD_DURATION_MINUTES`, `PLATFORM_COMMISSION_RATE (10%)`, `GST_TAX_RATE (18%)` | **REMOVE FROM CUSTOMER FLOW** | OTA hold and commission calculation engine. Direct booking and direct payments occur between customer and partner outside the platform. |
| `services/api/src/bookings/services/booking-expiry.service.ts` | `cleanupExpiredHolds` | **REMOVE FROM CUSTOMER FLOW** | Cleans up customer room holds. Unnecessary once customer room holds are eliminated. |
| `services/api/src/bookings/dto/create-booking-hold.dto.ts` | `CreateBookingHoldDto` | **REMOVE FROM CUSTOMER FLOW** | DTO defining customer hold request parameters. |
| `services/api/src/bookings/dto/confirm-booking.dto.ts` | `ConfirmBookingDto` | **REMOVE FROM CUSTOMER FLOW** | DTO defining customer confirmation parameters. |
| `services/api/src/bookings/bookings.module.ts` | `BookingsModule` | **REMOVE FROM CUSTOMER FLOW** | NestJS module bundling customer booking flows. |
| `apps/traveller-mobile/src/screens/HotelsScreen.tsx` | Line 54: `Hold & Pay` button, `ApiService.createBookingHold` | **MODIFY / REDESIGN** | Must replace "Hold & Pay" with Direct Contact ("Call Hotel", "WhatsApp Owner", "Send Enquiry"). |
| `apps/traveller-mobile/src/screens/CabsScreen.tsx` | Line 64: `Hold & Pay` button, `ApiService.createBookingHold` | **MODIFY / REDESIGN** | Must replace "Hold & Pay" with Direct Contact ("Call Driver", "WhatsApp Driver"). |

---

## 2. Customer Payments, Razorpay Provider & Webhooks

### Dependency Analysis
The payment subsystem is currently wired to customer booking IDs (`bookingId`). In the corrected product model, customer payments do NOT pass through YaatraSangi. However, the Razorpay integration and cryptographic verification logic are valuable and must be repurposed exclusively for partner annual subscription billing.
- **Consumers:**
  - `services/api/src/payments/payments.controller.ts`
  - `services/api/src/payments/payments.service.ts`
  - `services/api/src/payments/providers/razorpay-payment.provider.ts`
  - `services/api/src/payments/providers/mock-payment.provider.ts`

### File Classification
| File Path | Symbols / Routes | Classification | Justification & Dependencies |
| :--- | :--- | :--- | :--- |
| `services/api/src/payments/payments.controller.ts` | `POST /payments/create-order`, `POST /payments/verify`, `POST /payments/webhook` | **REPURPOSE FOR PARTNER SUBSCRIPTIONS** | Currently accepts `bookingId` and client-supplied `amount`. Must be refactored into `POST /subscriptions/create-order` and subscription webhook handling. |
| `services/api/src/payments/payments.service.ts` | `createOrder`, `verifyPayment`, `processWebhook` | **REPURPOSE FOR PARTNER SUBSCRIPTIONS** | Decouple from `booking` table and rewire to `Subscription` / `BusinessProfile` billing ledger. |
| `services/api/src/payments/providers/razorpay-payment.provider.ts` | `createOrder`, `verifyPayment`, `verifyWebhookSignature` | **KEEP / REUSE** | Generic HMAC-SHA256 signature verification and Razorpay order SDK interface. Highly reusable for subscription billing. |
| `services/api/src/payments/providers/mock-payment.provider.ts` | `MockPaymentProvider` | **KEEP / REUSE** | Reusable for local offline development and automated testing without live credentials. |
| `services/api/src/payments/interfaces/payment-gateway.interface.ts` | `IPaymentGateway`, `CreateOrderInput`, `VerifyPaymentInput` | **MODIFY / REDESIGN** | Redesign input/output types to represent subscription plan IDs and business profile IDs instead of booking IDs. |

---

## 3. Idempotency Implementation & Storage Backend

### Dependency Analysis
Idempotency is currently implemented as an in-memory `Map` (`IdempotencyService`) storing headers for 24 hours.
- **Consumers:**
  - `services/api/src/common/idempotency/idempotency.interceptor.ts`
  - `services/api/src/common/idempotency/idempotency.service.ts`
  - Applied via `@UseInterceptors(IdempotencyInterceptor)` on `POST /bookings/hold`

### File Classification
| File Path | Symbols / Routes | Classification | Justification & Dependencies |
| :--- | :--- | :--- | :--- |
| `services/api/src/common/idempotency/idempotency.interceptor.ts` | `IdempotencyInterceptor` | **KEEP / REUSE** | Reusable NestJS interceptor extracting `Idempotency-Key` HTTP header. |
| `services/api/src/common/idempotency/idempotency.service.ts` | `IdempotencyService`, `store = new Map()` | **MODIFY / REDESIGN** | Current in-memory store fails on multi-instance / restart. Must be backed by database/Redis store for subscription payments. |

---

## 4. Local Ride WebSocket, Gateway, Dispatch & Bidding

### Dependency Analysis
`LocalRidesGateway` maintains active driver socket connections and broadcasts ride requests to nearby drivers (`request_ride`, `driver_online`, `accept_ride`). Drivers submit bids/acceptances. Rule F states: "Local ride dispatch/bidding/live matching is NOT automatically in scope; mark existing dispatch functionality BUSINESS DECISION REQUIRED."
- **Consumers:**
  - `services/api/src/local-rides/local-rides.gateway.ts`
  - `services/api/src/local-rides/local-rides.service.ts`
  - `apps/traveller-web/src/app/vendor/page.tsx` (lines 16–52)
  - `apps/traveller-mobile/src/screens/LocalRidesScreen.tsx` (lines 20–65)

### File Classification
| File Path | Symbols / Routes | Classification | Justification & Dependencies |
| :--- | :--- | :--- | :--- |
| `services/api/src/local-rides/local-rides.gateway.ts` | `LocalRidesGateway`, `@SubscribeMessage('request_ride')`, `driver_online`, `accept_ride` | **BUSINESS DECISION REQUIRED** | Full real-time dispatch engine. If YaatraSangi is strictly a direct-contact directory, this dispatch engine should be decommissioned. If live matching is retained, it requires Redis pub/sub and geospatial indexes. |
| `services/api/src/local-rides/local-rides.service.ts` | `createRideBooking`, `acceptRide`, `updateRideStatus` | **BUSINESS DECISION REQUIRED** | Tied directly to dispatch/bidding workflow above. |
| `services/api/src/local-rides/local-rides.controller.ts` | `GET /local-rides`, `GET /local-rides/:id` | **KEEP / REUSE** | Directory listing endpoints for local drivers (auto, bike, cab) are core discovery features. |
| `apps/traveller-web/src/app/local-rides/page.tsx` | Directory list of drivers | **KEEP / REUSE** | Directory discovery page. |
| `apps/traveller-web/src/app/local-rides/[slug]/page.tsx` | Driver profile with "Call Driver" and "WhatsApp Driver" | **KEEP / REUSE** | Direct connection page aligned with product rules. |

---

## 5. Vendor / Partner Modules & Dashboards

### Dependency Analysis
Currently, `services/api/src/vendor/` consists of empty boilerplate classes (`VendorController`, `VendorService`). The partner dashboard features were hastily placed in `apps/traveller-web/src/app/vendor/page.tsx` (868 lines) and `apps/traveller-web/src/app/partner/page.tsx` (110 lines), while `apps/hotel-dashboard` and `apps/taxi-dashboard` are unmodified `create-next-app` templates.
- **Consumers:**
  - `apps/traveller-web/src/app/vendor/page.tsx`
  - `apps/traveller-web/src/app/partner/page.tsx`
  - `apps/hotel-dashboard/`
  - `apps/taxi-dashboard/`

### File Classification
| File Path | Symbols / Routes | Classification | Justification & Dependencies |
| :--- | :--- | :--- | :--- |
| `services/api/src/vendor/vendor.controller.ts` | `@Controller('vendor')` (empty) | **MODIFY / REDESIGN** | Needs complete implementation for partner business profiles, locations, asset cataloging, and subscription queries. |
| `services/api/src/vendor/vendor.service.ts` | `VendorService` (empty) | **MODIFY / REDESIGN** | Needs business logic for multi-business, multi-location profiles and subscription status checks. |
| `apps/traveller-web/src/app/partner/page.tsx` | Partner Dashboard mock | **MODIFY / REDESIGN** | Displays wrong trial ("3 Months Free Trial") and wrong pricing ("₹XYZ for bike/restaurant"). Must align with 6-month trial and free restaurant/local ride rules. |
| `apps/traveller-web/src/app/vendor/page.tsx` | 868-line monolithic partner portal | **MODIFY / REDESIGN** | Mixes websocket dispatch, mock asset management, and incomplete forms. Must be cleanly separated into proper partner portal workflows. |
| `apps/hotel-dashboard/` | Boilerplate Next.js | **MODIFY / REDESIGN** | Unimplemented placeholder. Architecture decision needed whether partner management remains unified in one portal or distributed across sub-apps. |
| `apps/taxi-dashboard/` | Boilerplate Next.js | **MODIFY / REDESIGN** | Unimplemented placeholder. |

---

## 6. Admin Dashboard & Admin API Routes / Guards

### Dependency Analysis
- Backend: Only ONE admin route exists: `@Get('admin-check')` in `services/api/src/auth/auth.controller.ts`, guarded by `RolesGuard`.
- Frontend: `apps/admin-panel` is unmodified boilerplate. `apps/traveller-web/src/app/admin/page.tsx` uses client-side `localStorage.getItem('superAdminAuth') === 'true'` and hardcoded email strings.
- Frontend seed: `apps/traveller-web/src/app/admin/seed/page.tsx` uploads mock data to Firebase from the browser.

### File Classification
| File Path | Symbols / Routes | Classification | Justification & Dependencies |
| :--- | :--- | :--- | :--- |
| `services/api/src/auth/guards/roles.guard.ts` | `RolesGuard`, `Role.SUPER_ADMIN` check | **KEEP / REUSE** | Solid role-based guard structure. Needs integration with tenant/business-scoped roles. |
| `services/api/src/auth/decorators/roles.decorator.ts` | `@Roles(...)` | **KEEP / REUSE** | Standard NestJS metadata decorator. |
| `services/api/src/auth/auth.controller.ts` | `GET /auth/admin-check` | **KEEP / REUSE** | Useful for health/permission probe. |
| `apps/traveller-web/src/app/admin/page.tsx` | Admin UI | **REMOVE FROM CUSTOMER FLOW** | Admin dashboard does not belong in the public traveller web application. Must reside in a dedicated secure admin portal. |
| `apps/traveller-web/src/app/admin/seed/page.tsx` | Browser Firebase seeding | **REMOVE FROM CUSTOMER FLOW** | Insecure direct Firestore seeding from browser. Must be deleted/decommissioned in favor of backend migrations/seed scripts. |
| `apps/admin-panel/` | Empty create-next-app | **MODIFY / REDESIGN** | Should become the true dedicated Admin portal with server-side authentication, KYC verification queues, content moderation, and partner subscription management. |

---

## 7. Partner Onboarding, KYC & Document Handling

### Dependency Analysis
`apps/traveller-web/src/app/partner-onboarding/page.tsx` implements a 3-step form with simulated client-side `setTimeout` loops claiming to run AI OCR and verification. No actual file uploads, no storage backend, and no backend API endpoint exists for partner KYC document submission.

### File Classification
| File Path | Symbols / Routes | Classification | Justification & Dependencies |
| :--- | :--- | :--- | :--- |
| `apps/traveller-web/src/app/partner-onboarding/page.tsx` | `PartnerOnboarding`, `handleVerification` | **MODIFY / REDESIGN** | Simulated AI scan must be replaced with real multipart/presigned upload to secure private storage (S3/GCS) and queued for admin verification. |
| Backend KYC routes | Non-existent in `services/api` | **MODIFY / REDESIGN** (TO CREATE) | Must create secure document upload and review endpoints in backend with admin approval workflow. |

---

## 8. Partner Pricing, Trial Text & Category Rules

### Product Alignment Audit
- **Rule:** Hotels, Outstation Taxi Operators, Tour Operators = Paid category, 1 six-month trial.
- **Rule:** Restaurants & Local Bike/Auto/City-cab = Permanently FREE.
- **Rule:** Annual plans only; no monthly plans.

### File Classification
| File Path | Text / Code Found | Classification | Required Alignment |
| :--- | :--- | :--- | :--- |
| `apps/traveller-web/src/app/partner/page.tsx` (line 20) | "3 Months Free Trial Active!" | **MODIFY / REDESIGN** | Update to "6 Months Free Trial Active". |
| `apps/traveller-web/src/app/partner/page.tsx` (lines 76, 84) | Lists fees for "Local Rides (Bikes)" and "Restaurants" | **MODIFY / REDESIGN** | Mark Restaurants and Local Rides as **100% Permanently Free**. |
| `database/prisma/schema.prisma` (lines 255–265) | `Subscription.trialEndsAt`, `Subscription.currentPeriodEnd` | **MODIFY / REDESIGN** | Refactor to link to `BusinessProfile` with category-aware logic (paid vs free categories). |

---

## 9. Public Pages & Mobile Screens (Hotel, Taxi, Restaurant, Tour, Ride)

### File Classification
| File Path | Current Content | Classification | Future Role |
| :--- | :--- | :--- | :--- |
| `apps/traveller-web/src/app/hotel/[slug]/page.tsx` | Static mock, WhatsApp/Call buttons | **KEEP / REUSE** | Core discovery mini-site template; switch from hardcoded mock to dynamic data. |
| `apps/traveller-web/src/app/taxi/[slug]/page.tsx` | Static mock, WhatsApp/Call buttons | **KEEP / REUSE** | Core discovery mini-site template. |
| `apps/traveller-web/src/app/restaurant/[slug]/page.tsx` | Static mock, WhatsApp/Call buttons | **KEEP / REUSE** | Core discovery mini-site template. |
| `apps/traveller-web/src/app/tour-packages/[slug]/page.tsx` | Static mock, WhatsApp/Call buttons | **KEEP / REUSE** | Core discovery mini-site template. |
| `apps/traveller-web/src/app/local-rides/[slug]/page.tsx` | Static mock, WhatsApp/Call buttons | **KEEP / REUSE** | Core discovery mini-site template. |
| `apps/traveller-mobile/src/screens/HotelsScreen.tsx` | Hotel list + "Hold & Pay" | **MODIFY / REDESIGN** | Remove booking hold dialog; replace with phone/WhatsApp actions. |
| `apps/traveller-mobile/src/screens/CabsScreen.tsx` | Taxi list + "Hold & Pay" | **MODIFY / REDESIGN** | Remove booking hold dialog; replace with phone/WhatsApp actions. |
| `apps/traveller-mobile/src/screens/LocalRidesScreen.tsx` | Live socket ride matching | **BUSINESS DECISION REQUIRED** | Align with founder decision on live dispatch vs driver directory. |
| `apps/traveller-mobile/src/screens/RestaurantsScreen.tsx` | Restaurant list | **KEEP / REUSE** | Discovery screen. |
| `apps/traveller-mobile/src/screens/PackagesScreen.tsx` | Tour package list | **KEEP / REUSE** | Discovery screen. |

---

## 10. Mini-Site Slug / Path Routing & Host Subdomain Handling

### Dependency Analysis
Currently, detail pages are served at path-based slugs: `/hotel/[slug]`, `/taxi/[slug]`, `/restaurant/[slug]`, `/tour-packages/[slug]`, `/local-rides/[slug]`. There is ZERO host/subdomain handling in `traveller-web`. Furthermore, `next.config.ts` has `output: 'export'`, which disables Next.js middleware and server-side request interception.

### File Classification
| File Path | Current Status | Classification | Future Role |
| :--- | :--- | :--- | :--- |
| `apps/traveller-web/next.config.ts` | `output: 'export'` | **MODIFY / REDESIGN** | Architecture decision required (see ADR draft). Static export cannot support dynamic wildcard subdomain routing. |
| `apps/traveller-web/src/app/hotel/[slug]/` | Path-based routing | **MODIFY / REDESIGN** | Needs unified mini-site template engine supporting business subdomains (`slug.yaatrasangi.com`). |
| `nginx/conf.d/default.conf` | `server_name localhost;` (no wildcards) | **MODIFY / REDESIGN** | Must configure wildcard `server_name ~^(?<subdomain>.+)\.yaatrasangi\.com$;` and SSL. |

---

## 11. Database Schema(s), Migrations & Seed Data

### Critical Finding: Schema Duality
The repository currently maintains **two conflicting SQLite Prisma schemas**:
1. `database/prisma/schema.prisma`: Defines models `User`, `Destination`, `Hotel` (String UUID id), `RoomType`, `RoomInventory`, `HotelBooking`, `TaxiCompany`, `Taxi`, `Restaurant`, `LocalRide`, `TourPackage`, `Subscription`, `Payment`, `LocalRideBooking`, `RideOffer`, `Review`.
2. `services/api/prisma/schema.prisma`: Defines models `User`, `Destination`, `PlaceToVisit`, `Hotel` (Int autoincrement id), `Tour`, `Booking`, `Ride`, `Taxi`, `Restaurant`, `Package`, `Review`.
3. `services/api/prisma/schema.postgres.prisma`: PostgreSQL draft matching the second schema.
4. **Migrations Directory:** Neither directory contains a `prisma/migrations/` directory. Changes have been applied with `prisma db push` on untracked local SQLite files (`dev.db`).

### File Classification
| File Path | Classification | Justification & Action Required |
| :--- | :--- | :--- |
| `database/prisma/schema.prisma` | **MODIFY / REDESIGN** | Primary candidate for reconciliation. Must introduce `BusinessProfile`, `BusinessLocation`, `StaffMembership`, and category-aware `Subscription` models. |
| `services/api/prisma/schema.prisma` | **REMOVE FROM CUSTOMER FLOW** | Divergent duplicate schema. Must be consolidated into a single authoritative schema. |
| `services/api/prisma/schema.postgres.prisma` | **MODIFY / REDESIGN** | Production PostgreSQL target schema once reconciled. |
| `database/prisma/seed.ts` | **MODIFY / REDESIGN** | Update seed data to populate directory categories, verified sample partners, and demo business profiles. |

---

## 12. Deployment, Nginx, Docker Compose, TLS & CI

### File Classification
| File Path | Classification | Key Findings & Required Changes |
| :--- | :--- | :--- |
| `docker-compose.yml` | **MODIFY / REDESIGN** | Binds Postgres (`5432`) and Redis (`6379`) to `0.0.0.0` without loopback restriction. Must bind to `127.0.0.1`. |
| `docker-compose.prod.yml` | **MODIFY / REDESIGN** | Binds DB/Redis host ports; uses hardcoded fallback secrets (`JWT_SECRET`, `POSTGRES_PASSWORD`). Missing HTTPS port 443. |
| `nginx/conf.d/default.conf` | **MODIFY / REDESIGN** | Missing TLS/SSL blocks, missing wildcard subdomain routing, missing security headers. |
| `.github/workflows/ci.yml` | **MODIFY / REDESIGN** | Mobile TypeScript check step fails due to compilation errors in `traveller-mobile`. Needs fixing before CI passes. |
