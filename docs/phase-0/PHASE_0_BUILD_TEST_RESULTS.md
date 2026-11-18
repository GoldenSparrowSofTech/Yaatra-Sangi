# Phase 0: Safe Baseline Build & Test Reproduction Results

**Generated:** 2026-11-18  
**Author:** Software Architecture & Security Engineering Review  
**Project:** YaatraSangi Monorepo  
**Status:** VERIFIED ON LOCAL ENVIRONMENT

---

## Executive Summary

| Verification Target | Command Executed | Exit Code | Duration | Outcome |
| :--- | :--- | :---: | :---: | :---: |
| **Backend Unit Tests** | `cd services\api && npm test` | `0` | 11.26s | **PASS** (20 files, 41 tests) |
| **Backend Production Build** | `cd services\api && npm run build` | `0` | ~15s | **PASS** |
| **Traveller Web Production Build** | `cd apps\traveller-web && npm run build` | `0` | ~18s | **PASS** (42 static/SSG pages) |
| **Mobile TypeScript Compilation** | `cd apps\traveller-mobile && npx tsc --noEmit` | `1` | ~7s | **FAIL** (11 typecheck errors) |
| **Docker Compose Config Validation** | `docker compose -f docker-compose.prod.yml config` | N/A | N/A | **NOT RUN** (Docker CLI not installed) |

---

## 1. Backend Unit Tests

- **Command:** `cmd /c "cd services\api && npm test"` (running Vitest v4.1.11 via `vitest run`)
- **Exit Code:** `0`
- **Duration:** 11.26s
- **Output Summary:**
  ```text
   RUN  v4.1.11 C:/Users/patel/OneDrive/Documents/Projects/yaatraSangi/services/api

   ✓ src/vendor/vendor.service.spec.ts (1 test) 1162ms
   ✓ src/local-rides/local-rides.controller.spec.ts (1 test) 1161ms
   ✓ src/packages/packages.service.spec.ts (1 test) 1051ms
   ✓ src/local-rides/local-rides.service.spec.ts (1 test) 1052ms
   ✓ src/vendor/vendor.controller.spec.ts (1 test) 1166ms
   ✓ src/app.controller.spec.ts (1 test) 1143ms
   ✓ src/auth/auth.service.spec.ts (3 tests) 918ms
   ✓ src/bookings/bookings.service.spec.ts (4 tests) 33ms
   ✓ src/payments/payments.service.spec.ts (3 tests) 36ms
   ✓ src/restaurants/restaurants.controller.spec.ts (1 test) 735ms
   ✓ src/restaurants/restaurants.service.spec.ts (1 test) 751ms
   ✓ src/packages/packages.controller.spec.ts (1 test) 745ms
   ✓ src/auth/auth.controller.spec.ts (3 tests) 741ms
   ✓ src/local-rides/local-rides.gateway.spec.ts (1 test) 639ms
   ✓ src/routing/routing.service.spec.ts (3 tests) 19ms
   ✓ src/auth/guards/roles.guard.spec.ts (5 tests) 16ms
   ✓ src/routing/services/route-optimizer.service.spec.ts (3 tests) 10ms
   ✓ src/common/idempotency/idempotency.service.spec.ts (4 tests) 15ms
   ✓ src/bookings/services/booking-expiry.service.spec.ts (1 test) 15ms
   ✓ src/hotels/hotels.service.spec.ts (2 tests) 16ms

   Test Files  20 passed (20)
        Tests  41 passed (41)
  ```
- **Observations:**
  - Notice that tests pass against mocked Prisma dependencies or in-memory fixtures.
  - Razorpay mock logger prints: `Razorpay keys not configured; using MockPaymentProvider for order creation`.
  - Bookings tests execute obsolete OTA hold and expiry routines (`Created 15-minute hold`, `Released and marked 3 expired booking hold(s)`).

---

## 2. Backend Production Build

- **Command:** `cmd /c "cd services\api && npm run build"` (running `@nestjs/cli` build)
- **Exit Code:** `0`
- **Duration:** ~15s
- **Output Summary:**
  ```text
  > api@0.0.1 build
  > nest build
  ```
- **Artifact:** Output compiled successfully to `services/api/dist/`.

---

## 3. Traveller Web Production Build

- **Command:** `cmd /c "cd apps\traveller-web && npm run build"` (running Next.js 16.3.6 with Turbopack)
- **Exit Code:** `0`
- **Duration:** ~18s
- **Output Summary:**
  ```text
  ▲ Next.js 16.3.6 (Turbopack)
  ✓ Running next.config.ts took 980ms
    Creating an optimized production build ...
  ✓ Compiled successfully in 3.1s
    Running TypeScript ...
    Finished TypeScript in 6.8s ...
    Collecting page data using 7 workers ...
  ✓ Generating static pages using 7 workers (42/42) in 2.4s
    Finalizing page optimization ...

  Route (app)
  ┌ ○ /
  ├ ○ /_not-found
  ├ ○ /admin
  ├ ○ /admin/seed
  ├ ○ /dashboard
  ├ ○ /destinations
  ├   /destinations/[id] (9 SSG paths)
  ├   /hotel/[slug] (3 SSG paths: grand-palace, sunset-resort, mountain-view)
  ├ ○ /hotels
  ├ ○ /local-rides
  ├   /local-rides/[slug] (3 SSG paths: ramesh-bhai, suresh-kumar, vikram-singh)
  ├ ○ /login
  ├ ○ /partner
  ├ ○ /partner-onboarding
  ├ ○ /plan
  ├   /restaurant/[slug] (1 SSG path: gordhan-thal)
  ├ ○ /restaurants
  ├ ○ /settings
  ├ ○ /signup
  ├ ○ /taxi
  ├   /taxi/[slug] (3 SSG paths: royal-cabs, shiv-taxi, premium-rides)
  ├ ○ /tour-packages
  ├   /tour-packages/[slug] (3 SSG paths: goa-4-days, manali-trip, kerala-tour)
  └ ○ /vendor

  ○  (Static)  prerendered as static content
  ●  (SSG)     prerendered as static HTML (uses generateStaticParams)
  ```
- **Observations:**
  - Build succeeds because `output: 'export'` is set in `next.config.ts`.
  - All dynamic detail routes use small static arrays in `generateStaticParams()` containing 1 to 3 mock slugs.
  - Static export renders pure static HTML files into `apps/traveller-web/out/`.

---

## 4. Mobile TypeScript Check

- **Command:** `cmd /c "cd apps\traveller-mobile && npx tsc --noEmit"`
- **Exit Code:** `1` (**FAILURE**)
- **Duration:** ~7s
- **Exact Compiler Error Log:**
  ```text
  App.tsx(6,10): error TS2724: '"./src/services/api.service"' has no exported member named 'apiService'. Did you mean 'ApiService'?
  App.tsx(26,124): error TS2322: Type 'number' is not assignable to type 'string'.
  App.tsx(27,124): error TS2322: Type 'number' is not assignable to type 'string'.
  App.tsx(28,117): error TS2322: Type 'number' is not assignable to type 'string'.
  App.tsx(29,129): error TS2322: Type 'number' is not assignable to type 'string'.
  App.tsx(30,123): error TS2322: Type 'number' is not assignable to type 'string'.
  App.tsx(31,128): error TS2322: Type 'number' is not assignable to type 'string'.
  App.tsx(32,133): error TS2322: Type 'number' is not assignable to type 'string'.
  App.tsx(33,125): error TS2322: Type 'number' is not assignable to type 'string'.
  src/components/SideDrawer.tsx(4,10): error TS2305: Module '"../config/api"' has no exported member 'API_BASE_URL'.
  src/screens/PartnerDashboardScreen.tsx(4,10): error TS2305: Module '"../config/api"' has no exported member 'API_BASE_URL'.
  src/screens/TravelerLoginScreen.tsx(3,10): error TS2305: Module '"../config/api"' has no exported member 'API_BASE_URL'.
  ```
- **Root Causes:**
  1. `App.tsx` imports `{ apiService }` but `api.service.ts` exports `export const ApiService`.
  2. `App.tsx` lines 26–33 pass numeric values where string props are expected.
  3. `SideDrawer.tsx`, `PartnerDashboardScreen.tsx`, and `TravelerLoginScreen.tsx` attempt to import `API_BASE_URL` from `../config/api`, but `config/api.ts` exports `API_URL` instead.
- **Impact:** CI workflow (`.github/workflows/ci.yml` line 74) will fail on this step during automated checks.

---

## 5. Docker Compose Config Validation

- **Command:** `cmd /c "docker compose version"`
- **Exit Code:** `1`
- **Output:** `'docker' is not recognized as an internal or external command, operable program or batch file.`
- **Status:** **NOT RUN**
- **Reason:** Docker engine / Docker CLI is not installed in the Windows host environment. Per Phase 0 Safety Rule 2 ("Do not install missing tools"), this check is safely skipped and marked NOT RUN.
