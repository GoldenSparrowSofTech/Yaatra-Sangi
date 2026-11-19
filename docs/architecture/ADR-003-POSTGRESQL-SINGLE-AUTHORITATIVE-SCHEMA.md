# ADR-003: PostgreSQL as the Single Authoritative Database Schema

- **Status:** Accepted by founder; migration design and data mapping required before schema cutover
- **Decision date:** 2026-11-18
- **Project:** YaatraSangi
- **Decision owner:** Product owner / founder

## Context

Phase 0 found multiple competing Prisma schema files:
- `database/prisma/schema.prisma` — SQLite-oriented schema variant with UUID-style string IDs and models including `HotelBooking`, `LocalRideBooking` and `Subscription`.
- `services/api/prisma/schema.prisma` — a second SQLite-oriented schema variant with integer/autoincrement IDs and models including `Booking`, `Ride` and `Destination`.
- `services/api/prisma/schema.postgres.prisma` — PostgreSQL schema variant.

The current repository therefore has schema drift and inconsistent identifiers/domain models. The project requires production-grade relational integrity and geospatial discovery.

## Decision

**PostgreSQL is the authoritative database engine and there will be one canonical Prisma schema and one migration history.**

Canonical schema location for the target architecture:
`database/prisma/schema.prisma`

This file must become the PostgreSQL schema (`provider = "postgresql"`) after a deliberate reconciliation and migration plan. It must not simply be overwritten with the current PostgreSQL draft.

### Data access boundary

- The NestJS API is the authoritative server-side database access layer.
- There must be one canonical Prisma Client generation configuration and one supported import boundary.
- Do not generate competing Prisma Clients from multiple schema files or allow apps to connect directly to the production database.
- If a shared workspace package is needed to encapsulate Prisma Client and database types, propose it and document the package boundary before implementation.
- PostgreSQL is used for production and should be the standard integration-test target. Local/test database provisioning must be documented and reproducible.

### Geospatial capability

Use PostGIS for geographic coordinates, radius queries and location-aware discovery where appropriate. Confirm the selected PostgreSQL image/version includes the required PostGIS extension and that migrations provision it safely.

### Identifier strategy

Do not perform a blind global conversion of existing integer IDs to UUIDs. First:
1. Inventory every model, primary key, foreign key and external/API identifier.
2. Identify seeded/demo data versus any user or partner data that must be retained.
3. Map relationships and dependent references.
4. Choose a migration strategy (in-place mapping, shadow columns, mapping tables or controlled re-seeding for disposable data).
5. Define rollback and backup/restore procedures.
6. Update API contracts and mobile/web consumers deliberately.

## Required domain modelling principles

The eventual schema must support:
- User/owner accounts separate from business profiles.
- One owner or authorized member managing multiple business profiles.
- Multiple locations per business profile.
- Category-specific business profiles and entitlements.
- One approved public mini-site per eligible business profile.
- Staff membership and business-scoped permissions.
- Business verification separate from content publication and subscription status.
- Published content revisions separate from drafts awaiting review.
- Enquiries as distinct records from bookings.
- Annual subscription/trial rules for paid categories only.
- Permanently free restaurant and local bike/auto/city-cab provider categories.
- No customer hotel/taxi booking, customer checkout or booking commission domain in the target product.

This list is a target-domain requirement, not an instruction to create every table during Phase 1. The data model must be introduced incrementally with migration evidence.

## Migration safety requirements

- Never run `prisma migrate reset`, drop/recreate production tables, truncate, or destructive seed scripts against any environment containing user data.
- Never modify or delete `database/dev.db` as part of schema reconciliation.
- Create a database backup before any non-trivial migration in a persistent environment and verify that restoration is possible.
- Use expand-and-contract migrations where appropriate.
- Keep migrations forward-only unless a tested rollback is genuinely safe.
- Do not run migrations against production during Phase 1.
- Keep migration history under version control.
- Test migrations against a disposable PostgreSQL database with representative data.
- Record row counts, referential-integrity checks and migration results.

## Consequences

### Positive
- One source of truth for schema and migrations.
- Production/test behaviour is aligned with PostgreSQL.
- PostGIS supports radius-based discovery.
- Reduces drift between API and database packages.

### Negative / trade-offs
- Reconciliation requires careful data and API mapping.
- Existing SQLite development workflows may need to be replaced.
- PostgreSQL test infrastructure must be made available to CI/developers.

## Acceptance criteria

- [ ] A schema inventory and model/relationship map exists.
- [ ] The canonical schema path is confirmed and has PostgreSQL provider configuration.
- [ ] Duplicate schema responsibilities and generated-client ownership are documented.
- [ ] Existing IDs and foreign-key dependencies have an explicit migration plan.
- [ ] PostGIS extension/version requirements are documented and tested.
- [ ] A disposable PostgreSQL migration test succeeds before any persistent database migration.
- [ ] No existing database file or production data is deleted or reset.
- [ ] API and client identifier compatibility is documented.
