# 09. File-Level Change Register

## 1. Modified Files
The following files were modified to fix confirmed defects and eliminate security risks:

1. `docker-compose.prod.yml`
   - Removed predictable Redis fallback password (`redis_production_secret_key`).
   - Added mandatory variable check `${REDIS_PASSWORD:?REDIS_PASSWORD must be set in production}` for `command` and `healthcheck`.
   - Injected `REDIS_PASSWORD` into `api` service environment.

2. `services/api/src/main.ts`
   - Changed Helmet `frameguard` action to `sameorigin` to match Nginx reverse proxy headers.
   - Added Express `trust proxy` setting (`app.getHttpAdapter().getInstance().set('trust proxy', 1)`).
   - Added basic Content Security Policy definition.

3. `services/api/src/app.module.ts`
   - Registered `RateLimitGuard` as global provider (`APP_GUARD`).
   - Registered `TenantOwnershipGuard` as global provider (`APP_GUARD`).

4. `services/api/src/auth/auth.controller.ts`
   - Added `@Throttle(5, 60)` to `login`.
   - Added `@Throttle(3, 60)` to `register`.
   - Added `@RequireOwnership({ paramName: 'userId' })` to `profile`.

5. `services/api/src/auth/auth.service.spec.ts`
   - Added unit test asserting role downgrade to `TRAVELLER` when an unauthorized user attempts self-registration as `SUPER_ADMIN`.

6. `services/api/src/reviews/reviews.controller.ts`
   - Added `@Throttle(10, 60)` to `createReview`.

7. `services/api/src/payments/payments.controller.ts`
   - Added `@Throttle(10, 60)` to `createOrder` and `verifyPayment`.
   - Added `@Throttle(60, 60)` to `handleWebhook`.

8. `services/api/src/bookings/bookings.controller.ts`
   - Attached `@RequireOwnership({ paramName: 'id' })` to `GET /bookings/:id`.
   - Restricted `POST /bookings/cleanup-expired` with `@UseGuards(JwtAuthGuard, RolesGuard)` and `@Roles(Role.ADMIN, Role.SUPER_ADMIN)`.

9. `services/api/src/bookings/bookings.service.ts`
   - Changed unauthorized cross-tenant booking access exception from `BadRequestException` to `ForbiddenException('Access denied to this booking')`.

10. `services/api/src/bookings/bookings.service.spec.ts`
    - Added unit test verifying booking owner access.
    - Added unit test verifying `ForbiddenException` thrown when accessing a non-owned booking (IDOR protection).
    - Added unit test verifying `NotFoundException` handling.

11. `services/api/src/common/guards/tenant-ownership.guard.spec.ts`
    - Added unit test verifying `ADMIN` role access bypass.
    - Added unit test verifying `HOTEL_STAFF` cannot access another hotel's resource.

12. `apps/traveller-mobile/src/config/api.ts`
    - Exported `API_BASE_URL`.

13. `apps/traveller-mobile/src/services/api.service.ts`
    - Exported `apiService`.
    - Added `getDestinations()` method.
    - Updated `Destination` interface rating type.

14. `apps/traveller-mobile/src/screens/LocalRidesScreen.tsx`
    - Fixed icon name and route parameters.

## 2. Added Documentation Deliverables
The following documentation files were created under `docs/phase-1-corrective-verification/`:
- `01_CORRECTIVE_EXECUTIVE_SUMMARY.md`
- `02_GIT_INTEGRITY_REPORT.md`
- `03_SECURITY_VERIFICATION_REPORT.md`
- `04_MOBILE_VERIFICATION_REPORT.md`
- `05_DATABASE_VERIFICATION_REPORT.md`
- `06_LOCAL_RIDE_POLICY_VERIFICATION.md`
- `07_NEXTJS_RUNTIME_VALIDATION.md`
- `08_TEST_AND_BUILD_RESULTS.md`
- `09_FILE_LEVEL_CHANGE_REGISTER.md`
- `10_REMAINING_RISKS_AND_BLOCKERS.md`
- `11_FINAL_PHASE_1_EXIT_GATE.md`
