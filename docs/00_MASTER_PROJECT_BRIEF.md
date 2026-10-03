# Master Project Brief

## Product
Travel planning + booking platform.

Core flow:
**Build Your Own Trip → Optimize Route → Plan Stay → Select Transport → Book Everything**

Traveller destinations/cities કોઈપણ random orderમાં આપે. System actual road-network distance/time પરથી route optimize કરે.

Example:
`Rajkot → Dwarka → Beyt Dwarka → Somnath → Junagadh → Rajkot`

આ order hard-code કરવો નહીં.

## Platforms
- Traveller Web
- Traveller Android
- Traveller iOS
- Hotel Owner/Staff Dashboard
- Taxi Operator Dashboard
- Driver App
- Admin/Super Admin

## Stack
- Backend: Node.js + NestJS + TypeScript
- DB: PostgreSQL + PostGIS
- ORM: Prisma
- Cache/queues: Redis
- Web: Next.js + React + TypeScript + Tailwind
- Mobile: Flutter
- Storage: S3-compatible
- Maps/routing: provider abstraction; OSRM/Google/Mapbox/self-hosted
- Deployment: Docker + Nginx + Ubuntu
- API: REST `/api/v1`

## Roles
TRAVELLER, HOTEL_OWNER, HOTEL_STAFF, TAXI_OWNER, DRIVER, ADMIN, SUPER_ADMIN

## Hotel rule
Default hotel search radius = **10 km** from selected destination. Search only approved + active hotels. Use PostGIS `ST_DWithin` and return distance in km. Radius must be configurable.

## Taxi rule
Taxi search uses pickup location + service area + availability + vehicle type + pricing. Do not reuse hotel 10 km rule.

## Booking safety
Use temporary holds, DB transactions, row locks (`FOR UPDATE`), price snapshots, idempotency, expiry cleanup, cancellation/refund.

## Money/time
Money: Decimal/NUMERIC, never float.
Time: UTC/TIMESTAMPTZ, convert at UI.

## Final definition
Final release is only complete when backend/web/mobile build, migrations, tests, payments, booking concurrency, admin, Docker, Nginx, Ubuntu deployment, backup/restore, monitoring, CI/CD and release artifacts are verified.
