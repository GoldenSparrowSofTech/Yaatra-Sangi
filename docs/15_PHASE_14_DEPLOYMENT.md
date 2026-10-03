# Phase 14 — Docker, Nginx, Ubuntu & Production

Production:
Internet → Nginx → Web/API → Redis → PostgreSQL/PostGIS → object storage.

Docker images:
API, route engine if separate, traveller web, dashboards, admin.

Ubuntu:
supported LTS, Docker Engine/Compose, firewall, SSH hardening, updates.

Nginx:
TLS, HTTP→HTTPS, reverse proxy, upload limits, timeouts, security headers.

Separate dev/staging/prod environments.

Database:
migrations, backups, restore test, recovery plan.

Monitoring:
app/access/error logs, health, CPU/RAM/disk, DB connections, Redis.

Exit: fresh Ubuntu server can be provisioned and platform deployed from docs.
