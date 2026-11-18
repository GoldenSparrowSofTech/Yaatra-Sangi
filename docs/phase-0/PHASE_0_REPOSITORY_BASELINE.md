# Phase 0: Repository Baseline & Working-Tree Safety Report

**Generated:** 2026-11-18  
**Author:** Software Architecture & Security Engineering Review  
**Project:** YaatraSangi Monorepo  
**Status:** COMPLETE (READ-ONLY BASELINE)

---

## 1. Repository Identity

| Property | Value / Status |
| :--- | :--- |
| **Repository Root** | `c:\Users\patel\OneDrive\Documents\Projects\yaatraSangi` |
| **Current Branch** | `modification/completeRestructureProject` |
| **Current HEAD Commit** | `b2865712ef536475ad46223a74987f608935eaa8` |
| **Commit Message** | `Add Antigravity Phase 0 prompt and corrected master implementation spec` |
| **Audit Baseline Commit** | `6cd501b170590ff67df16a6ba5f93d5dcfb5c628` |
| **HEAD Matches Audit Commit?** | **NO** (HEAD is 1 commit ahead of audit commit) |
| **Code Changes Since Audit?** | **ZERO CODE CHANGES**. Git diff between `6cd501b` and `HEAD` consists entirely of documentation changes in `docs/` (`ANTIGRAVITY_PHASE_0_PROMPT.md`, `YAATRASANGI_CORRECTED_MASTER_IMPLEMENTATION_SPEC.md`, removal of obsolete phase markdown and zip). |

---

## 2. Remote Configuration

```text
origin  https://github.com/GoldenSparrowSofTech/Yaatra-Sangi.git (fetch)
origin  https://github.com/GoldenSparrowSofTech/Yaatra-Sangi.git (push)
```
- Embedded credentials in remotes: **None detected (clean HTTPS URL)**.

---

## 3. Working-Tree Safety & Uncommitted Work

Command executed: `git status --short`  
Result: **Working tree clean (zero modified, untracked, or staged files).**

- **Uncommitted User Work:** None currently present in the working tree.
- **Safety Directive:** Any future uncommitted files created during developer work must be marked **USER WORK — DO NOT OVERWRITE** and preserved across sessions. Phase 0 has modified zero application or configuration files.

---

## 4. Package Manager & Environment Versions

| Tool | Version Detected | Location / Notes |
| :--- | :--- | :--- |
| **Node.js** | `v26.12.1` | Local host PATH (`C:\Program Files\nodejs\node.exe`) |
| **npm** | `11.20.0` | Local host PATH (`package.json` specifies `"packageManager": "npm@11.17.0"`) |
| **pnpm** | Not installed / Not in PATH | Not configured as repository package manager |
| **yarn** | Not installed / Not in PATH | Not configured as repository package manager |
| **Docker / Docker Compose** | Not installed / Not in PATH | Local host does not have Docker CLI installed |

### Monorepo Workspaces & Lockfiles

The repository is configured as an npm workspace monorepo (`package.json`):
- Workspaces: `apps/*`, `services/*`, `packages/*`
- Root lockfile: `package-lock.json` (present)
- Package-level lockfiles present:
  - `services/api/package-lock.json`
  - `apps/traveller-web/package-lock.json`
  - `apps/traveller-mobile/package-lock.json`
  - `database/package-lock.json`

---

## 5. Working Tree Structure Overview

```text
yaatraSangi/
├── apps/
│   ├── admin-panel/          # Default create-next-app boilerplate (unmodified template)
│   ├── hotel-dashboard/      # Default create-next-app boilerplate (unmodified template)
│   ├── taxi-dashboard/       # Default create-next-app boilerplate (unmodified template)
│   ├── traveller-mobile/     # React Native / Expo 57 mobile client
│   └── traveller-web/        # Next.js 16.3.6 web app (output: 'export' static export)
├── database/
│   ├── prisma/
│   │   ├── schema.prisma     # SQLite schema variant 1 (HotelBooking, LocalRideBooking, Subscription)
│   │   ├── dev.db            # SQLite local database file
│   │   └── seed.ts           # Database seeding script
├── docs/
│   ├── ANTIGRAVITY_PHASE_0_PROMPT.md
│   ├── YAATRASANGI_CORRECTED_MASTER_IMPLEMENTATION_SPEC.md
│   └── phase-0/              # Phase 0 generated reports
├── nginx/
│   └── conf.d/
│       └── default.conf      # HTTP port 80 proxy configuration (no TLS, no wildcard)
├── services/
│   └── api/                  # NestJS 12 REST API + Socket.io Gateway
│       ├── prisma/
│       │   ├── schema.prisma # SQLite schema variant 2 (Booking, Ride, Destination, etc.)
│       │   └── schema.postgres.prisma # PostgreSQL schema variant
│       └── src/
├── docker-compose.yml        # Development docker-compose (Postgres + Redis)
├── docker-compose.prod.yml   # Production docker-compose (Postgres + Redis + API + Web + Nginx)
├── package.json              # Monorepo root configuration
└── turbo.json                # Turborepo build pipeline configuration
```
