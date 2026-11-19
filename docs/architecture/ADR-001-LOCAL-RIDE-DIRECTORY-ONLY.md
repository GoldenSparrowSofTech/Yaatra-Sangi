# ADR-001: Local Ride Providers as a Free Direct-Contact Directory

- **Status:** Accepted by founder; implementation subject to dependency validation
- **Decision date:** 2026-11-18
- **Project:** YaatraSangi
- **Decision owner:** Product owner / founder

## Context

YaatraSangi is a discovery and direct-connection mediator. It does not arrange or fulfil customer bookings. Customers contact business partners directly; partners and customers handle availability, booking, confirmation, payment, cancellation and fulfilment outside YaatraSangi.

The confirmed permanently free local-ride category is limited to local **bike, auto-rickshaw and city-cab** service providers. Outstation taxi operators are a separate paid annual-subscription category.

The existing repository contains a Socket.IO ride-dispatch/bidding workflow. Its presence in the codebase does not constitute product approval.

## Decision

Local ride providers will be presented as a **permanently free directory and direct-contact listing category**.

Traveller interactions:
- Browse/search local bike, auto-rickshaw and city-cab provider listings.
- View approved provider/business information and service areas.
- Contact the provider directly using available phone or WhatsApp actions.
- Submit a general enquiry where the product supports it.

YaatraSangi will not operate local ride dispatch in this product scope:
- No passenger ride request dispatch.
- No driver online/offline dispatch presence.
- No driver bidding or passenger bid acceptance.
- No ride assignment, ride status lifecycle, pickup OTP or ride fulfilment.
- No in-platform ride booking or payment.

Local ride providers remain permanently free. They must not be asked to pay registration, listing, subscription or commission fees. A business that also offers outstation taxi services must have separately classified service profiles/entitlements; do not infer that all services are free or paid from one mixed label.

## Consequences

### Positive
- Consistent with the direct-contact mediator model.
- Avoids real-time dispatch operational and safety responsibilities.
- Removes the need for live driver state, ride bidding and dispatch scaling in the initial product.
- Keeps local ride discovery available as a free supply category.

### Negative / trade-offs
- Existing dispatch code may become unused.
- Some mobile screens and API contracts require redesign.
- Existing tests may encode dispatch behaviour and will need replacement or explicit archival.

## Implementation constraints

1. **Quarantine before deletion.** First map every import, route, test, mobile screen, WebSocket event, notification and database relation that depends on dispatch.
2. Do not delete the gateway/service/schema in the same change that removes a UI button.
3. Preserve reusable local-provider directory APIs and profile data.
4. Replace dispatch-oriented traveller UI with direct contact and enquiry actions.
5. Remove dispatch routes from public navigation and prevent new dispatch sessions from being created once the approved cutover is implemented.
6. Retain historical data until a separately approved retention/migration decision is documented.
7. Update tests to assert that the public local-ride experience is directory-only.
8. Do not classify outstation taxi operators as free local-ride providers.

## Acceptance criteria

- [ ] Local bike, auto-rickshaw and city-cab listings remain discoverable.
- [ ] Traveller pages expose direct contact actions, not ride dispatch.
- [ ] No customer ride booking/payment/dispatch flow is reachable from supported traveller journeys.
- [ ] No new dispatch event can be initiated through public API/mobile/web paths after cutover.
- [ ] Local ride category entitlements are permanently free.
- [ ] Outstation taxi subscription policy remains separate.
- [ ] Dependency map, tests and release notes identify the quarantined dispatch components.
- [ ] No historical data is destructively deleted as part of this ADR.
