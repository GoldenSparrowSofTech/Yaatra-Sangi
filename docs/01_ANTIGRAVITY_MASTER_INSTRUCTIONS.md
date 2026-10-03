# Google Antigravity Master Instructions

## Non-negotiable
Do not wait for user approval between phases. Execute phases sequentially until the project reaches the final release gate.

## Coding markers
Every coding change must clearly identify:
- 🟦 PREVIOUS CODE
- 🟩 NEW CODE
- 🟨 UPDATED CODE
- 🟥 REMOVE / REPLACE
- 🟪 INTEGRATION
- 🧪 TEST

## Quality
Never call a phase complete because files were generated. COMPLETE means:
- compile/build passes
- migrations pass
- tests pass
- API integration works
- UI integration works
- acceptance criteria pass

## Production rules
- No hard-coded route ordering.
- No frontend-only booking availability.
- No fake payment success.
- No production mocks.
- Provider abstractions must allow real production services.
- Web and mobile must use the same API/business rules.
- Provider users must be tenant-isolated.
- Secrets never go to Git.

## Execution order
01 Architecture
02 Database/Auth/RBAC
03 Locations/Route Engine
04 Trip/Map/Itinerary
05 Hotel Platform
06 Hotel Search/Booking
07 Taxi Platform
08 Payment/Finance
09 Reviews/Notifications/Support
10 Admin
11 Web Applications
12 Flutter Mobile
13 Security/Testing
14 Docker/Ubuntu/Nginx
15 CI/CD
16 Final Ready-to-Deploy

## Final output
Produce:
- production backend
- production web
- Android release artifact
- iOS release artifact
- database migrations
- deployment files
- tests
- API docs
- operations/runbook
- backup/restore procedure
- monitoring/logging
