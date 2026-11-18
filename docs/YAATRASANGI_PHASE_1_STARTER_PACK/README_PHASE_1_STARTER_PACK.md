# YaatraSangi — Phase 1 Starter Pack

This pack contains the founder-approved architectural decisions and a controlled Google Antigravity implementation prompt.

## Included files

- `ADR-001-LOCAL-RIDE-DIRECTORY-ONLY.md`
- `ADR-002-UNIFIED-NEXTJS-MINI-SITE-RUNTIME.md`
- `ADR-003-POSTGRESQL-SINGLE-AUTHORITATIVE-SCHEMA.md`
- `PHASE_1_GOOGLE_ANTIGRAVITY_IMPLEMENTATION_PROMPT.md`

## Founder-approved working decisions

1. Local rides: permanently free direct-contact directory for local bike, auto-rickshaw and city-cab providers. Dispatch/bidding is out of scope and must be quarantined before any deletion.
2. Mini-sites: one unified Next.js Node.js server runtime for the main website and partner subdomains. The precise Next.js 16.3.6 implementation must be technically validated before runtime conversion.
3. Database: PostgreSQL is authoritative, with one canonical Prisma schema at `database/prisma/schema.prisma` and one migration history. Reconcile schemas and IDs safely; no blind UUID conversion or destructive migration.

## How to use

1. Extract this pack.
2. Copy the three ADR files into the repository at `docs/architecture/`.
3. Copy the Phase 1 prompt into the repository root or open it in Antigravity.
4. Open the existing YaatraSangi repository in Google Antigravity.
5. Paste the full prompt into Antigravity.
6. Review the initial Git safety report before allowing code changes.
7. When Phase 1 completes, upload the complete `docs/phase-1/` folder as a ZIP for review.

## Important

The prompt explicitly prohibits production deployment, production migrations, Git pushes, destructive database commands, deleting user work and broad rewrites. It also prohibits beginning Phase 2 automatically.
