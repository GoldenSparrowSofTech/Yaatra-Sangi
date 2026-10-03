# Phase 01 — Architecture & Repository

```text
travel-platform/
├── apps/
│   ├── traveller-web/
│   ├── traveller-mobile/
│   ├── hotel-dashboard/
│   ├── taxi-dashboard/
│   ├── driver-app/
│   └── admin-panel/
├── services/
│   ├── api/
│   └── route-engine/
├── packages/
│   ├── types/
│   ├── validation/
│   ├── constants/
│   ├── api-client/
│   └── ui/
├── database/
├── infrastructure/
├── docs/
├── docker-compose.yml
└── README.md
```

Backend modules:
auth, users, roles, permissions, destinations, trips, route, hotels, rooms, taxis, vehicles, drivers, hotel-bookings, taxi-bookings, payments, commissions, reviews, wishlists, notifications, support, admin.

Exit criteria:
- monorepo works
- Docker local stack works
- API health works
- environment setup documented
- CI baseline works
