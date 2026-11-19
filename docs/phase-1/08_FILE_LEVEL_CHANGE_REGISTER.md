# Phase 1: File-Level Change Register

**Generated:** 2026-11-18  
**Author:** Configuration Management & Release Engineering Lead  
**Scope:** Complete Audit Log of Files Modified, Created, and Preserved in Phase 1

---

## 1. Summary of Changes

- **Files Created:** 15
- **Files Modified:** 12
- **Files Deleted:** 0
- **User Work Overwritten:** 0

---

## 2. Detailed Change Register

| File Path | Change Type | Reason / Architectural Authority |
| :--- | :---: | :--- |
| `docs/architecture/ADR-001-LOCAL-RIDE-DIRECTORY-ONLY.md` | Created | Copy of founder-approved ADR-001 |
| `docs/architecture/ADR-002-UNIFIED-NEXTJS-MINI-SITE-RUNTIME.md` | Created | Copy of founder-approved ADR-002 |
| `docs/architecture/ADR-003-POSTGRESQL-SINGLE-AUTHORITATIVE-SCHEMA.md` | Created | Copy of founder-approved ADR-003 |
| `docker-compose.yml` | Modified | SEC-02: Bound Postgres & Redis ports strictly to `127.0.0.1` |
| `docker-compose.prod.yml` | Modified | SEC-02 & SEC-03: Removed host ports for DB/Redis; removed fallback secrets; added Redis auth |
| `services/api/src/auth/jwt.config.ts` | Created | SEC-03: Shared JWT configuration failing startup if missing in production |
| `services/api/src/auth/jwt.config.spec.ts` | Created | Automated tests for production JWT secret validation |
| `services/api/src/auth/jwt.strategy.ts` | Modified | SEC-03: Uses `getJwtSecret()`, eliminating hardcoded fallback |
| `services/api/src/auth/auth.module.ts` | Modified | SEC-03: Uses `getJwtSecret()`, eliminating hardcoded fallback |
| `services/api/src/payments/payments.service.ts` | Modified | SEC-03: Fails webhook processing if secret is unconfigured in production |
| `services/api/.env.example` | Modified | SEC-03: Updated environment variable documentation and secure placeholders |
| `services/api/src/common/guards/rate-limit.guard.ts` | Created | SEC-04: In-memory sliding-window rate limiter guard |
| `services/api/src/common/guards/rate-limit.guard.spec.ts` | Created | Automated tests for rate limiter guard |
| `services/api/src/common/guards/tenant-ownership.guard.ts` | Created | SEC-07: Resource-level tenant ownership and IDOR guard |
| `services/api/src/common/guards/tenant-ownership.guard.spec.ts` | Created | Automated tests for tenant ownership guard |
| `services/api/src/main.ts` | Modified | SEC-05 & SEC-06: Strict CORS allowlist and baseline security headers |
| `nginx/conf.d/default.conf` | Modified | SEC-06: Baseline HTTP security headers in reverse proxy |
| `apps/traveller-web/src/app/admin/page.tsx` | Modified | SEC-01: Removed `localStorage.getItem('superAdminAuth')` and email allow-list |
| `apps/traveller-web/src/app/admin/seed/page.tsx` | Modified | SEC-01: Disabled browser-based database seeding |
| `apps/traveller-web/src/app/partner-onboarding/page.tsx` | Modified | SEC-08: Replaced fake simulated AI OCR scanning with `PENDING_REVIEW` state |
| `apps/traveller-mobile/src/config/api.ts` | Modified | Workstream 4: Exported `API_BASE_URL` alongside `API_URL` |
| `apps/traveller-mobile/src/services/api.service.ts` | Modified | Workstream 4: Exported `apiService` and added `getDestinations()` method |
| `apps/traveller-mobile/src/types/index.ts` | Modified | Workstream 4: Updated `Destination.rating` type to `string \| number` |
| `apps/traveller-mobile/src/screens/LocalRidesScreen.tsx` | Modified | ADR-001: Replaced dispatch loop with direct-contact driver directory |
| `services/api/src/local-rides/local-rides.gateway.ts` | Modified | ADR-001: Quarantined real-time ride dispatch requests |
| `services/api/src/local-rides/local-rides.gateway.spec.ts` | Modified | Automated tests verifying ADR-001 dispatch quarantine behavior |
| `docs/phase-1/01_PHASE_1_EXECUTIVE_SUMMARY.md` | Created | Phase 1 deliverable 1 |
| `docs/phase-1/02_SECURITY_REMEDIATION_REPORT.md` | Created | Phase 1 deliverable 2 |
| `docs/phase-1/03_MOBILE_BUILD_REMEDIATION_REPORT.md` | Created | Phase 1 deliverable 3 |
| `docs/phase-1/04_DATABASE_CONSOLIDATION_AND_MIGRATION_PLAN.md` | Created | Phase 1 deliverable 4 |
| `docs/phase-1/05_LOCAL_RIDE_DIRECT_DIRECTORY_CUTOVER_REPORT.md` | Created | Phase 1 deliverable 5 |
| `docs/phase-1/06_NEXTJS_RUNTIME_VALIDATION_REPORT.md` | Created | Phase 1 deliverable 6 |
| `docs/phase-1/07_TEST_AND_BUILD_RESULTS.md` | Created | Phase 1 deliverable 7 |
| `docs/phase-1/08_FILE_LEVEL_CHANGE_REGISTER.md` | Created | Phase 1 deliverable 8 |
| `docs/phase-1/09_RISKS_BLOCKERS_AND_UNVERIFIED_ITEMS.md` | Created | Phase 1 deliverable 9 |
| `docs/phase-1/10_PHASE_1_EXIT_GATE.md` | Created | Phase 1 deliverable 10 |
