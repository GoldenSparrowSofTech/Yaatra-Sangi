# 03. Security Verification Report

## 1. Redis Production Password Enforcement
- **Defect Identified**: `docker-compose.prod.yml` used a default fallback password:
  ```yaml
  command: redis-server --requirepass ${REDIS_PASSWORD:-redis_production_secret_key}
  ```
- **Remediation**:
  Updated both `command` and `healthcheck` to enforce mandatory environment variable declaration:
  ```yaml
  command: redis-server --requirepass ${REDIS_PASSWORD:?REDIS_PASSWORD must be set in production}
  healthcheck:
    test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD:?REDIS_PASSWORD must be set in production}", "ping"]
  ```
  Injected `REDIS_PASSWORD: ${REDIS_PASSWORD}` into the `api` service environment to ensure credential consistency.
  Redis port `6379` is kept internal to the Docker bridge network (`app-network`) and not bound to public host interfaces.

## 2. Admin Authentication & Role Tampering
- **Server-Side Guard Enforcement**:
  - `JwtAuthGuard` extracts and validates JWT tokens from the `Authorization: Bearer <token>` header.
  - `RolesGuard` enforces role metadata configured via `@Roles(Role.ADMIN, Role.SUPER_ADMIN)`.
- **Privilege Escalation Prevention**:
  - In `auth.service.ts`, self-registration forces role to `TRAVELLER` regardless of payload input.
  - Protected endpoints like `POST /bookings/cleanup-expired` require explicit `ADMIN` or `SUPER_ADMIN` roles.
  - Added unit test in `auth.service.spec.ts` asserting that attempts to register as `SUPER_ADMIN` downgrade gracefully to `TRAVELLER`.

## 3. Tenant Ownership & IDOR Protection
- **Global Guard Registration**:
  - Registered `TenantOwnershipGuard` via `APP_GUARD` in `AppModule`.
  - Decorated endpoints check ownership matching `req.user.sub` or `req.user.businessId` against target resource ID or tenant parameter.
- **Controller Integration**:
  - `BookingsController`:
    - `@Get(':id')`: Enforces `@RequireOwnership({ paramName: 'id' })`.
    - `BookingsService.getBooking`: Standardized forbidden tenant access to throw `ForbiddenException` (HTTP 403) instead of `BadRequestException` (HTTP 400).
  - `AuthController`:
    - `@Get('profile')`: Enforces `@RequireOwnership({ paramName: 'userId' })`.
- **Test Verification**:
  - Added unit test in `tenant-ownership.guard.spec.ts` proving `HOTEL_STAFF` cannot access another hotel's resource (HTTP 403).
  - Added unit test in `bookings.service.spec.ts` verifying IDOR rejection on non-owned bookings.

### Route Protection Coverage Table
| Route / Controller | Method | Guard(s) | Ownership / Scope Check | Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET /api/v1/auth/profile` | `GET` | `JwtAuthGuard`, `TenantOwnershipGuard` | `@RequireOwnership` param check | **VERIFIED** |
| `POST /api/v1/auth/login` | `POST` | Public (`@Throttle(5, 60)`) | N/A (credentials validated in DB) | **VERIFIED** |
| `POST /api/v1/auth/register` | `POST` | Public (`@Throttle(3, 60)`) | Role forced to `TRAVELLER` | **VERIFIED** |
| `GET /api/v1/bookings/:id` | `GET` | `JwtAuthGuard`, `TenantOwnershipGuard` | Sub / Tenant ID checked in DB query | **VERIFIED** |
| `POST /api/v1/bookings/cleanup-expired` | `POST` | `JwtAuthGuard`, `RolesGuard` | Requires `ADMIN` or `SUPER_ADMIN` | **VERIFIED** |
| `POST /api/v1/reviews` | `POST` | `JwtAuthGuard`, `@Throttle(10, 60)` | Authenticated user verification | **VERIFIED** |
| `POST /api/v1/payments/create-order` | `POST` | `JwtAuthGuard`, `@Throttle(10, 60)` | Authenticated user check | **VERIFIED** |
| `POST /api/v1/payments/verify` | `POST` | `JwtAuthGuard`, `@Throttle(10, 60)` | Razorpay signature cryptographic check | **VERIFIED** |
| `POST /api/v1/payments/webhook` | `POST` | Public (`@Throttle(60, 60)`) | Webhook HMAC-SHA256 signature check | **VERIFIED** |

## 4. JWT & Production Secrets
- Verified that secrets fail fast when missing via `ConfigModule` and environment validation.
- Enforced required production environment variables:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `REDIS_PASSWORD`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`
- Zero hardcoded credentials committed in git repository.

## 5. Rate Limiting
- `RateLimitGuard` registered globally via `APP_GUARD`.
- In-memory sliding window protects against brute force and volumetric denial of service.
- Sensitive routes protected with specific throttles:
  - `POST /auth/login`: 5 req / 60 sec
  - `POST /auth/register`: 3 req / 60 sec
  - `POST /reviews`: 10 req / 60 sec
  - `POST /payments/create-order`: 10 req / 60 sec
  - `POST /payments/verify`: 10 req / 60 sec
  - `POST /payments/webhook`: 60 req / 60 sec

## 6. CORS & Origin Controls
- Restricted allowed origins in `main.ts`:
  - `APP_URL` / `process.env.FRONTEND_URL`
  - `http://localhost:3000` (dev)
  - Mobile scheme origins (`capacitor://localhost`, `http://localhost`)
- Credentials (`credentials: true`) enabled for cross-origin authentication cookies/headers.

## 7. Security Headers & Proxy Trust
- **Issue Resolved**: Previously, `main.ts` configured Helmet with `X-Frame-Options: DENY` while `nginx.conf` sent `SAMEORIGIN`. Standardized `main.ts` to `SAMEORIGIN` to eliminate proxy header clashes.
- **Proxy Trust**: Configured `app.getHttpAdapter().getInstance().set('trust proxy', 1)` in `main.ts` so client IP is accurately obtained from `X-Forwarded-For`.
- **Content Security Policy**: Baseline directives established in Helmet configuration.

## 8. KYC Verification Integrity
- `KycService` verifies document upload and transitions vendor status to `PENDING_REVIEW`.
- Replaced mock/simulated "AI verification auto-approvals" with an authoritative admin review workflow.
- Status transitions are guarded server-side; vendors cannot mutate their own verification state.
