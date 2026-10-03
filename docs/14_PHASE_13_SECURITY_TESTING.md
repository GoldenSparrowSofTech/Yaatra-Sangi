# Phase 13 — Security & Testing

Security:
JWT, refresh rotation, hashing, rate limits, CORS, secure headers, validation, authorization, tenant isolation, signed uploads, webhook validation, secrets management, audit, dependency scanning.

Unit:
route optimization, pricing, booking, cancellation, commission, permissions.

Integration:
PostgreSQL/PostGIS, hotel inventory, taxi availability, payments.

E2E:
register/login → trip → destinations → route → map → itinerary → hotel 10 km search → room → hold → payment → confirmation → taxi → booking → cancellation/refund.

Concurrency:
multiple users attempting final room; expected no negative inventory/no double successful reservation.

Exit only when acceptance suite passes.
