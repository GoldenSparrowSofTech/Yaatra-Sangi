# 06. Local Ride Policy Verification

## 1. Context & Policy Specification (ADR-001)
YaatraSangi operates strictly as a discovery and direct-connection directory for local rides (auto-rickshaws, e-rickshaws, local bikes, and city cabs).
The platform is **NOT** a ride-hailing, dispatch, bidding, or fare settlement service.

## 2. Policy Enforcements
1. **Permanent Free Model**:
   - Local ride drivers/owners are permanently free from registration, listing, subscription, or commission fees.
2. **Direct Connection Only**:
   - Travellers view listings and connect directly via phone call or WhatsApp.
   - Fare negotiations and payments take place entirely offline between passenger and driver.
3. **No Ride Dispatch or Bidding**:
   - Zero dispatch queues.
   - Zero ride assignment algorithms.
   - Zero driver bidding mechanisms.
   - Zero in-app geolocation tracking or turn-by-turn navigation.

## 3. Code Audit Results
- **`services/api`**:
  - `rides.controller.ts` and `rides.service.ts` provide directory lookup and listing management endpoints (`GET /rides`, `GET /rides/:id`, `POST /rides`).
  - No dispatch routes, ride-matching engines, or transactional ride payment routes exist.
- **`apps/traveller-web`**:
  - `/local-rides` and `/local-rides/[slug]` pages render directory listing details, direct call buttons, and WhatsApp link openers.
  - No live vehicle tracking or digital meter calculation scripts.
- **`apps/traveller-mobile`**:
  - `LocalRidesScreen.tsx` provides clean list of local ride operators with direct `tel:` and `whatsapp:` links.
  - No background location polling or driver-side accept/reject flows.

## 4. Quarantine / Removal of Non-Compliant Concepts
All speculative ride-dispatch, surge pricing, or transactional ride commissioning code from legacy iterations has been completely excised and confirmed absent.
