# Phase 1: Local Ride Direct-Directory Transition & Dispatch Quarantine Report

**Generated:** 2026-11-18  
**Author:** Product & Architecture Lead  
**Authority:** ADR-001 (Local Ride Providers as a Free Direct-Contact Directory)  
**Status:** **TRANSITION EXECUTED & QUARANTINED**

---

## 1. Context & Product Mandate

Per the authoritative product specification (`YAATRASANGI_CORRECTED_MASTER_IMPLEMENTATION_SPEC.md`) and **ADR-001**:
- YaatraSangi operates strictly as a discovery and direct-contact mediator.
- Local **bike, auto-rickshaw, and city-cab** providers form a **100% permanently free** directory category.
- Centralized real-time ride dispatch, driver bidding, passenger bid acceptance, live vehicle tracking, and OTP verification are **out of scope**.
- Customers contact local captains directly via Phone or WhatsApp.

---

## 2. Inventory of Affected Components & Dependencies

| Area | File Path | Component / Symbols | Action Taken in Phase 1 |
| :--- | :--- | :--- | :--- |
| **Mobile UI** | `apps/traveller-mobile/src/screens/LocalRidesScreen.tsx` | Socket connection (`io`), `request_ride`, live matching loop | **REPLACED** with Direct-Contact Directory UI |
| **Backend Gateway** | `services/api/src/local-rides/local-rides.gateway.ts` | `@WebSocketGateway`, `@SubscribeMessage('request_ride')` | **QUARANTINED** (intercepts and rejects public dispatch requests) |
| **Backend Service** | `services/api/src/local-rides/local-rides.service.ts` | `createRideBooking`, `acceptRide`, `updateRideStatus` | **PRESERVED FOR DIRECTORY LISTINGS** (quarantined dispatch methods) |
| **Backend Controller**| `services/api/src/local-rides/local-rides.controller.ts` | `GET /local-rides`, `GET /local-rides/:id` | **ACTIVE** (serves directory data) |
| **Web UI** | `apps/traveller-web/src/app/local-rides/page.tsx`<br>`apps/traveller-web/src/app/local-rides/[slug]/page.tsx` | Directory list and detail mini-site with "Call" and "WhatsApp" | **ALIGNED** (already follows direct mediator model) |

---

## 3. Implementation Details

### 1. Mobile Screen Overhaul (`LocalRidesScreen.tsx`)
The previous dispatch workflow (request ride -> waiting spinner -> simulated auto-acceptance -> OTP screen) was completely removed from the traveller journey.
- **New Interface:**
  - Category filters: **All Rides**, **🛺 Auto**, **🏍️ Bike**, **🚕 City Cab**.
  - City search filter: Real-time filtering by city name and driver name.
  - Driver cards displaying: Driver name, vehicle model, vehicle registration number, verified badge, rating, reviews count, and base fare / per-km rates.
  - Direct Actions:
    - **📞 Call Driver:** Invokes native dialer via `tel:${driver.contactPhone}`.
    - **💬 WhatsApp:** Opens WhatsApp conversation with pre-filled enquiry message:
      `Hello {driverName}, I found your contact on YaatraSangi and would like to hire your ride.`

### 2. Backend Dispatch Quarantine (`LocalRidesGateway.ts`)
Per ADR-001 implementation constraint 1 ("Quarantine before deletion"), the backend WebSocket gateway was not abruptly deleted, ensuring zero runtime crashes for any cached client connections.
- When an unauthorized client emits `request_ride`, the gateway intercepts the event:
  ```typescript
  console.warn('[ADR-001 Quarantine] Real-time ride dispatch request rejected. Direct contact directory in effect.');
  return {
    event: 'ride_dispatch_quarantined',
    data: {
      success: false,
      message: 'On-demand ride dispatch is disabled per ADR-001. Please browse driver directory and contact directly.',
    },
  };
  ```
- **Automated Verification:** `local-rides.gateway.spec.ts` unit test asserts that dispatch requests return `ride_dispatch_quarantined` and log a quarantine warning.

---

## 4. Verification & Non-Regressive Evidence
1. **Local Ride Discovery Remains 100% Operational:** Directory endpoints (`GET /local-rides`) and public web routes (`/local-rides`, `/local-rides/[slug]`) continue functioning normally.
2. **Zero Booking / Commission Flows:** No ride bookings, payments, or commission calculations are reachable from mobile or web traveller workflows.
3. **Outstation Taxis Kept Separate:** Outstation cabs (`apps/traveller-mobile/src/screens/CabsScreen.tsx`) are maintained as a distinct category under the annual subscription model.
