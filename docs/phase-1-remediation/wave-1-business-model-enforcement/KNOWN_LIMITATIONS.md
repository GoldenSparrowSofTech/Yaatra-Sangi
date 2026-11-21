# Wave 1: Known Limitations and Future Scope

## 1. Out of Scope for Wave 1
Per task specifications, the following architectural items were strictly excluded from Wave 1 and are scheduled for subsequent remediation waves:

### 1.1 Canonical Database Migration (PostgreSQL)
- **Current State**: Active Prisma schema remains configured with `provider = "sqlite"` using local `dev.db`.
- **Future Wave Target**: Unification into a single authoritative PostgreSQL schema (`schema.prisma`), generating initial canonical baseline migrations (`prisma/migrations`), and resolving the container startup crash risk against `docker-compose.prod.yml`.

### 1.2 Partner Subscription Billing
- **Current State**: Customer booking payment order creation is disabled. No partner subscription purchase or recurring billing endpoints currently exist.
- **Future Wave Target**: Architecture and implementation of partner subscription billing (annual plans, tier entitlements, 6-month free trial eligibility) strictly segregated from customer payments.

### 1.3 Next.js Dynamic Subdomain Runtime (ADR-002)
- **Current State**: `apps/traveller-web` builds with `output: 'export'` (static export). No `middleware.ts` exists for wildcard host header resolution.
- **Future Wave Target**: Transition `apps/traveller-web` to standalone Node.js server container mode with host-based dynamic mini-site routing (`<slug>.yaatrasangi.com`) behind wildcard Nginx ingress.

### 1.4 KYC Document Upload & Object Storage
- **Current State**: Document upload is client-side only without backend storage persistence.
- **Future Wave Target**: Implementation of private object storage (S3/Cloudflare R2), signed upload URLs, and administrative verification queues.

## 2. Retained Functional Guarantees
- No customer can create or confirm booking holds.
- No customer can initiate Razorpay orders for travel bookings.
- No live driver dispatch or ride assignment can be executed.
- Discovery catalogs for hotels, taxis, restaurants, packages, and local rides remain 100% operational with direct Call and WhatsApp contact.
