# Phase 12 — Flutter Android + iOS

Recommended:
```text
lib/
├── core/
├── features/
│   ├── auth/
│   ├── home/
│   ├── trips/
│   ├── route/
│   ├── hotels/
│   ├── taxis/
│   ├── bookings/
│   ├── payments/
│   ├── notifications/
│   └── profile/
└── shared/
```

Traveller app must support same API/business rules as web.

Traveller screens: auth, home, trip creation, route, map, itinerary, hotel, taxi, booking, payment, trips, profile, notifications.

Driver app: login, assigned trips, trip details, navigation, start/end, earnings, profile.

Cache non-sensitive data only. Never trust stale offline booking/payment state.

Exit: Android and iOS release builds support representative trip → hotel → taxi flow.
