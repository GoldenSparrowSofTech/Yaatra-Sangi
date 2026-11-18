# Phase 0: Security Baseline Review

**Generated:** 2026-11-18  
**Author:** Software Architecture & Security Engineering Review  
**Project:** YaatraSangi Monorepo  
**Safety Protocol:** Secret values redacted. Verified from source code and configuration inspection.

---

## 1. Executive Summary & Findings Matrix

| Finding ID | Severity | Area | Source Status | Summary Description |
| :---: | :---: | :---: | :---: | :--- |
| **SEC-01** | **P0 (Critical)** | Auth & Admin | Confirmed from Source | Client-side admin authorization based on `localStorage` flag and hardcoded emails in public web app. |
| **SEC-02** | **P0 (Critical)** | Data Exposure | Confirmed from Source | Host port exposure of PostgreSQL (`5432`) and unauthenticated Redis (`6379`) to `0.0.0.0` in production Compose. |
| **SEC-03** | **P0 (Critical)** | Integrity | Confirmed from Source | Fallback default secrets configured for JWT signing and Razorpay webhook HMAC verification. |
| **SEC-04** | **P1 (High)** | API Security | Confirmed from Source | Missing global input validation pipe (`ValidationPipe`) and global rate limiting (`ThrottlerGuard`). |
| **SEC-05** | **P1 (High)** | Network / CORS | Confirmed from Source | Wildcard permissive CORS (`app.enableCors()`) and WebSocket CORS enabled without origin restrictions. |
| **SEC-06** | **P1 (High)** | Infrastructure | Confirmed from Source | Missing TLS/SSL (HTTPS) termination and missing HTTP security headers in Nginx and NestJS. |
| **SEC-07** | **P1 (High)** | Multi-Tenancy | Confirmed from Source | Absence of resource-level tenant/business-profile ownership verification in API controllers. |
| **SEC-08** | **P1 (High)** | KYC / Compliance| Confirmed from Source | Simulated partner document verification (`setTimeout`) with zero storage backend or access control. |
| **SEC-09** | **P2 (Medium)** | Cryptography | Confirmed from Source | Webhook signature verification uses `JSON.stringify(eventData)` re-serialization rather than raw request buffer. |
| **SEC-10** | **P2 (Medium)** | Reliability | Confirmed from Source | In-memory idempotency cache (`Map`) lost on server restart or under multi-instance deployments. |

---

## 2. Detailed Findings (Source Confirmed)

### SEC-01: Admin Trust via LocalStorage & Hardcoded Emails (P0)
- **File:** `apps/traveller-web/src/app/admin/page.tsx` (lines 14–24)
- **Source Code Evidence:**
  ```typescript
  const isSuperAdmin = typeof window !== 'undefined' && localStorage.getItem('superAdminAuth') === 'true';
  setUser(currentUser || (isSuperAdmin ? { email: 'superAdmin' } : null));

  // Basic client-side protection
  if (currentUser && currentUser.email !== 'admin@travelpartner.com' && currentUser.email !== 'admin@gmail.com' && !isSuperAdmin) {
    // window.location.href = "/";
  } else if (!currentUser && !isSuperAdmin) {
    window.location.href = "/login";
  }
  ```
- **Vulnerability Analysis:**
  1. Any user opening DevTools can set `localStorage.setItem('superAdminAuth', 'true')` and gain access to the admin dashboard UI.
  2. The email whitelist relies on hardcoded string literals (`'admin@travelpartner.com'`, `'admin@gmail.com'`).
  3. The redirect check for unauthorized emails is commented out (`// window.location.href = "/";`).
  4. The admin dashboard is packaged directly inside the public traveller web bundle rather than an isolated, internal application.

---

### SEC-02: Public Host Port Exposure for Database & Redis (P0)
- **Files:**
  - `docker-compose.yml` (lines 11, 18)
  - `docker-compose.prod.yml` (lines 13, 29)
- **Source Code Evidence:**
  ```yaml
  # docker-compose.prod.yml
  services:
    postgres:
      ports:
        - "5432:5432"
    redis:
      ports:
        - "6379:6379"
  ```
- **Vulnerability Analysis:**
  Binding container ports directly as `"5432:5432"` and `"6379:6379"` without prefixing loopback `127.0.0.1` binds them to all host network interfaces (`0.0.0.0`). On a cloud VPS or public server, PostgreSQL and Redis become directly accessible from the public internet. Redis runs without password authentication (`requirepass`), allowing unauthenticated remote command execution or data manipulation.

---

### SEC-03: Hardcoded Fallback Secrets for JWT & Razorpay (P0)
- **Files:**
  - `services/api/src/auth/jwt.strategy.ts` (line 18)
  - `services/api/src/auth/auth.module.ts` (line 13)
  - `services/api/src/payments/payments.service.ts` (line 33)
  - `docker-compose.prod.yml` (lines 10, 50, 52)
- **Source Code Evidence:**
  - `JWT_SECRET`: `secretOrKey: process.env.JWT_SECRET || 'super-secret-key'`
  - `RAZORPAY_WEBHOOK_SECRET`: `process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret'`
  - Compose default: `${JWT_SECRET:-yaatrasangi_production_jwt_secret_key_2026}`
- **Vulnerability Analysis:**
  If an environment variable is omitted or fails to load in production, the application silently defaults to predictable hardcoded keys. Attackers can forge valid JWT admin tokens or generate valid HMAC-SHA256 signatures for fake Razorpay webhook events.

---

### SEC-04: Missing Global DTO Validation & Rate Limiting (P1)
- **File:** `services/api/src/main.ts` (lines 4–10)
- **Source Code Evidence:**
  ```typescript
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const port = process.env.PORT || 3001;
    await app.listen(port, '0.0.0.0');
  }
  ```
- **Vulnerability Analysis:**
  1. `app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))` is missing. DTO class-validator decorators are NOT enforced globally. Any endpoint accepting `@Body()` can receive unstripped, unvalidated arbitrary JSON payloads.
  2. No rate limiting guard (`ThrottlerGuard`) or module (`ThrottlerModule`) is configured in `app.module.ts` or `main.ts`. Authentication endpoints (`POST /auth/login`, `POST /auth/register`) and payment webhooks are vulnerable to brute-force and Denial-of-Service attacks.

---

### SEC-05: Unrestricted CORS & Socket Security (P1)
- **Files:**
  - `services/api/src/main.ts` (line 6: `app.enableCors();`)
  - `services/api/src/local-rides/local-rides.gateway.ts` (line 13: `@WebSocketGateway({ cors: true })`)
- **Vulnerability Analysis:**
  Default `app.enableCors()` with no parameters reflects incoming origins and permits requests with wildcard access. The WebSocket gateway accepts connections from any origin. This exposes internal API and gateway endpoints to Cross-Site WebSocket Hijacking (CSWSH) and unauthorized cross-origin requests.

---

### SEC-06: Missing TLS/SSL & Security Headers in Nginx (P1)
- **File:** `nginx/conf.d/default.conf` (lines 11–14)
- **Source Code Evidence:**
  - Nginx listens only on `listen 80;` with `server_name localhost;`.
  - Port 443 (SSL/TLS) is absent.
  - Zero HTTP security headers configured:
    - Missing `X-Content-Type-Options: nosniff`
    - Missing `X-Frame-Options: DENY / SAMEORIGIN`
    - Missing `Content-Security-Policy`
    - Missing `Strict-Transport-Security` (HSTS)
    - Missing `Referrer-Policy`

---

### SEC-07: Missing Resource-Level Tenant Ownership Checks (P1)
- **Files:**
  - `services/api/src/bookings/bookings.controller.ts` (line 53: `GET /bookings/:id`)
  - `services/api/src/hotels/hotels.controller.ts`
  - `services/api/src/taxis/taxis.controller.ts`
- **Vulnerability Analysis:**
  Endpoints verify that a caller possesses a valid JWT token (`JwtAuthGuard`), but do NOT verify whether the requested entity (hotel profile, taxi record, enquiry, or booking) belongs to the caller's business profile or tenant. Any authenticated user can read or manipulate records belonging to another vendor by guessing or enumerating IDs (Insecure Direct Object Reference - IDOR).

---

### SEC-08: Insecure Partner KYC Document Handling (P1)
- **File:** `apps/traveller-web/src/app/partner-onboarding/page.tsx` (lines 25–46)
- **Vulnerability Analysis:**
  1. Verification is purely simulated in client-side JavaScript via `setTimeout` timers.
  2. Files selected by the partner (RC Book, Insurance, Fitness) are never transmitted to a backend, never stored in encrypted private cloud storage (S3/GCS bucket), and never validated.
  3. No virus scanning, MIME-type verification, or size enforcement exists on the uploaded files.
  4. Backend contains zero partner document upload or verification review routes.

---

### SEC-09: Webhook Signature Verification Flaw (P2)
- **File:** `services/api/src/payments/payments.controller.ts` (lines 47–58)
- **Source Code Evidence:**
  ```typescript
  @Post('webhook')
  async handleWebhook(@Headers('x-razorpay-signature') signature: string, @Body() eventData: any) {
    const rawBody = JSON.stringify(eventData);
    return this.paymentsService.processWebhook(rawBody, signature, eventData);
  }
  ```
- **Vulnerability Analysis:**
  Computing HMAC-SHA256 signatures over `JSON.stringify(eventData)` rather than the raw HTTP request byte buffer is vulnerable to verification failure or signature bypass if field ordering, whitespace, or floating point serialization in Express JSON parser differs from Razorpay's exact payload bytes.

---

### SEC-10: In-Memory Idempotency Storage (P2)
- **File:** `services/api/src/common/idempotency/idempotency.service.ts` (line 12)
- **Source Code Evidence:**
  `private readonly store = new Map<string, IdempotencyRecord>();`
- **Vulnerability Analysis:**
  The idempotency store resides in process memory. If the Node.js API restarts or runs in multiple cluster instances / containers, duplicate requests with identical `Idempotency-Key` headers will not be detected, leading to duplicate transaction processing.

---

## 3. Concerns Requiring Runtime Verification

The following items cannot be fully verified from static code alone and require runtime environment verification:
1. **Network Firewall Rules:** Whether cloud infrastructure (e.g. AWS Security Groups, Hetzner Firewall, DigitalOcean Cloud Firewall) blocks external traffic to ports 5432 and 6379 despite Docker container port mapping.
2. **Reverse Proxy TLS Offloading:** Whether an external Load Balancer (Cloudflare, AWS ALB) terminates HTTPS in front of Nginx port 80.
3. **Database Credentials in Production:** Whether production environment files inject cryptographically strong, non-default passwords for PostgreSQL and Redis.
