# Phase 1: Test & Build Results Report

**Generated:** 2026-11-18  
**Author:** Quality Assurance & Release Engineering Lead  
**Scope:** Automated Test Execution & Build Verification Post-Remediation

---

## 1. Test & Build Execution Matrix

| Test Suite / Target | Exact Command Executed | Exit Code | Duration | Outcome | Details |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Backend Unit Tests** | `cmd /c "cd services\api && npm test"` | `0` | 11.24s | **PASS** | 23 test suites passed (23), 53 tests passed (53) |
| **Backend Production Build** | `cmd /c "cd services\api && npm run build"` | `0` | ~15s | **PASS** | `@nestjs/cli` compilation succeeded to `dist/` |
| **Traveller Web Build** | `cmd /c "cd apps\traveller-web && npm run build"` | `0` | ~19s | **PASS** | Next.js 16.3.6 Turbopack (42 static/SSG pages) |
| **Mobile TypeScript Compilation** | `cmd /c "cd apps\traveller-mobile && npx tsc --noEmit"` | `0` | ~6s | **PASS** | Clean compilation, 0 diagnostic errors |
| **Docker Compose Config Check** | `cmd /c "docker compose version"` | N/A | N/A | **NOT RUN** | Docker CLI not installed in Windows host |

---

## 2. Detailed Backend Test Results (Vitest v4.1.11)

```text
 RUN  v4.1.11 C:/Users/patel/OneDrive/Documents/Projects/yaatraSangi/services/api

 ✓ src/common/guards/rate-limit.guard.spec.ts (3 tests) 22ms
 ✓ src/common/guards/tenant-ownership.guard.spec.ts (5 tests) 22ms
 ✓ src/vendor/vendor.service.spec.ts (1 test) 789ms
 ✓ src/local-rides/local-rides.controller.spec.ts (1 test) 790ms
 ✓ src/vendor/vendor.controller.spec.ts (1 test) 791ms
 ✓ src/app.controller.spec.ts (1 test) 767ms
 ✓ src/restaurants/restaurants.service.spec.ts (1 test) 779ms
 ✓ src/local-rides/local-rides.service.spec.ts (1 test) 732ms
 ✓ src/packages/packages.service.spec.ts (1 test) 745ms
 ✓ src/packages/packages.controller.spec.ts (1 test) 790ms
 ✓ src/restaurants/restaurants.controller.spec.ts (1 test) 848ms
 ✓ src/local-rides/local-rides.gateway.spec.ts (2 tests) 767ms
 ✓ src/auth/auth.controller.spec.ts (3 tests) 820ms
 ✓ src/auth/auth.service.spec.ts (3 tests) 1212ms
 ✓ src/payments/payments.service.spec.ts (3 tests) 27ms
 ✓ src/bookings/bookings.service.spec.ts (4 tests) 30ms
 ✓ src/common/idempotency/idempotency.service.spec.ts (4 tests) 28ms
 ✓ src/routing/routing.service.spec.ts (3 tests) 24ms
 ✓ src/auth/jwt.config.spec.ts (3 tests) 21ms
 ✓ src/hotels/hotels.service.spec.ts (2 tests) 15ms
 ✓ src/bookings/services/booking-expiry.service.spec.ts (1 test) 25ms
 ✓ src/auth/guards/roles.guard.spec.ts (5 tests) 22ms
 ✓ src/routing/services/route-optimizer.service.spec.ts (3 tests) 9ms

 Test Files  23 passed (23)
      Tests  53 passed (53)
   Duration  11.24s
```

### New Security Test Suites Introduced in Phase 1
1. **`jwt.config.spec.ts` (3 tests):** Asserts production fail-closed behavior when `JWT_SECRET` is unset; validates dev fallbacks.
2. **`rate-limit.guard.spec.ts` (3 tests):** Asserts sliding-window request counting and 429 Too Many Requests response on rate limit breach.
3. **`tenant-ownership.guard.spec.ts` (5 tests):** Asserts that users cannot read or modify other tenants' resources; validates `SUPER_ADMIN` privileges.
4. **`local-rides.gateway.spec.ts` (2 tests):** Asserts that real-time ride dispatch requests are quarantined and rejected per ADR-001.

---

## 3. Detailed Mobile TypeScript Compilation Results

- **Command:** `cd apps/traveller-mobile && npx tsc --noEmit`
- **Baseline Result:** 12 diagnostic errors (Exit Code 1).
- **Post-Remediation Result:** **0 diagnostic errors (Exit Code 0)**.
- **Root Cause Fixes Verified:**
  - Exported `API_BASE_URL` alongside `API_URL` in `src/config/api.ts`.
  - Added `getDestinations()` method and exported `apiService` in `src/services/api.service.ts`.
  - Corrected `Destination.rating` type in `src/types/index.ts` to `string | number`.
  - Replaced dispatch socket loop with directory interface in `src/screens/LocalRidesScreen.tsx`.
