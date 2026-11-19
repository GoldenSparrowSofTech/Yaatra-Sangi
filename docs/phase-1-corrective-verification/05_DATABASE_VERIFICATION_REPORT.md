# 05. Database Verification Report

## 1. Authoritative Architecture & Canonical Target
As mandated by **ADR-003**, PostgreSQL is the single authoritative production database for YaatraSangi.
- **ORM / Schema Manager**: Prisma ORM (`services/api/prisma/schema.prisma`).
- **Target Database**: PostgreSQL 16+.
- **Database Engine**: Relational, multi-tenant with indexed tenant and foreign key constraints.

## 2. Safe Migration & Non-Destructive Principles
- **No Reset**: `prisma migrate reset` and `db push --force-reset` are strictly prohibited in all verification and production deployment environments.
- **Preservation of Existing Data**: All schemas preserve historic audit logs, user records, and booking state.
- **Migration Strategy**: Forward-only, additive SQL migrations via `prisma migrate deploy`.

## 3. Schema & Entity Integrity
Inspected `schema.prisma`:
- `User`: Handles identity, password hash, role (`Role` enum), and multi-tenant `businessId`.
- `Business`: Central multi-tenant entity representing hotels, taxi operators, tour operators, restaurants, and local ride providers.
- `RideListing`: Local ride directory entity storing vehicle type, contact phone, operating areas, and pricing guide.
- `Booking`: Direct enquiry/reservation entity with lifecycle status tracking.
- `PaymentOrder`: Razorpay order records and subscription transaction records.
- `KycDocument`: Vendor verification assets linked to business entities.

## 4. Current State & Verification
- Database schema matches API model definitions and validation DTOs.
- No SQLite or divergent MongoDB instances are active in production configurations.
- Docker compose production service defines PostgreSQL container with healthcheck and persistent volume mapping (`postgres_data`).
