# Phase 1: Risks, Blockers & Unverified Items Report

**Generated:** 2026-11-18  
**Author:** Risk Management & Technical Governance Lead  
**Scope:** Transparent Assessment of Unverified Environment Items, External Dependencies, and Strategic Risks

---

## 1. Unverified Items (Local Environment Boundaries)

| Item Description | Status | Reason / Technical Boundary | Recommended Action in Phase 2 |
| :--- | :---: | :--- | :--- |
| **Docker Compose Runtime Validation** | **NOT RUN** | Docker CLI and daemon are not installed on the Windows developer host. | Validate `docker compose -f docker-compose.prod.yml config` in CI pipeline on Ubuntu runner. |
| **Live TLS Certificate Termination** | **NOT RUN** | Production domain DNS and Wildcard Let's Encrypt certificates cannot be provisioned on a local offline workstation. | Provision Wildcard DNS and Certbot certificate on target production VPS. |
| **Persistent PostgreSQL Migration Execution** | **NOT RUN (BY DESIGN)** | Phase 1 Safety Rule 3 strictly forbids running migrations against persistent or production databases. | Execute reconciled migration on a disposable PostgreSQL integration database in Phase 2. |
| **Private S3/GCS Object Storage Integration** | **BLOCKED (BY DESIGN)** | No live cloud credentials or active S3 bucket are configured in the repository. | Configure AWS S3 or Cloudflare R2 bucket with presigned upload URLs during Phase 2 partner KYC implementation. |

---

## 2. Strategic Technical Risks & Mitigations

| Risk ID | Risk Description | Severity | Impact | Mitigation Strategy |
| :---: | :--- | :---: | :--- | :--- |
| **RSK-101** | **Next.js Standalone Migration Deployment Complexity** | Medium | Switching `apps/traveller-web` from static HTML export to Node.js server container requires container lifecycle orchestration. | Update production Dockerfile to multi-stage build copying `.next/standalone` and static assets cleanly. |
| **RSK-102** | **Wildcard DNS / Subdomain Resolution** | Medium | Wildcard routing (`*.yaatrasangi.com`) requires wildcard A/CNAME record in authoritative DNS and Let's Encrypt wildcard cert. | Ensure Cloudflare or DNS provider handles `*.yaatrasangi.com` to host server IP before mini-site cutover. |
| **RSK-103** | **Legacy OTA Booking Table Quarantining** | Low | Existing `HotelBooking` and `Booking` models remain in SQLite schema until PostgreSQL migration cutover. | Execute expand-and-contract migration in Phase 2, isolating legacy tables without data loss. |
