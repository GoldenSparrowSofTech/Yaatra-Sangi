# 10. Remaining Risks and Blockers

## 1. Genuine Production Risks

### 1.1 In-Memory Rate Limiting vs Distributed Instances
- **Current State**: `RateLimitGuard` uses an in-memory sliding-window map (`Map<string, { count, resetTime }>`).
- **Risk**: For a single container instance, this works reliably. In a multi-replica or clustered production environment behind a load balancer, rate limit state is not shared across replicas.
- **Phase 2 Remediation**: Upgrade `RateLimitGuard` to use Redis-backed rate limiting (e.g. `ioredis` or `@nestjs/throttler` with Redis storage provider).

### 1.2 Redis Availability During Startup
- **Current State**: Redis password must be provided via `REDIS_PASSWORD`.
- **Risk**: If the production environment does not define `REDIS_PASSWORD` in `.env.production`, container startup will abort immediately by design (`:?REDIS_PASSWORD must be set in production`).
- **Remediation**: Operational runbooks and CI/CD secret managers must ensure `REDIS_PASSWORD` is injected prior to deployment.

### 1.3 Local Docker Daemon Absence
- **Current State**: Docker CLI is not installed on the local Windows developer host.
- **Risk**: Local container execution could not be verified dynamically on this specific workstation, although compose syntax and environment rules were verified statically.

## 2. Blockers
- **Zero Phase 1 Blockers**: All critical Phase 1 defects (predictable fallback password, IDOR risks, TypeScript compilation failures, header mismatches) have been resolved.
- **Phase 2 Gate**: Development of Phase 2 features must not begin until user explicitly reviews and approves this report.
