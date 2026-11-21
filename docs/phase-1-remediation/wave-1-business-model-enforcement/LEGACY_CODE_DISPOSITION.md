# Wave 1: Legacy Code Disposition

## 1. Overview
In accordance with Wave 1 constraints, no database tables, Prisma models, or migrations were deleted. Legacy business logic was isolated, disabled from external invocation, and retained for auditability and forward compatibility.

## 2. Inventory of Retained and Modified Components

| Component | File Path | Original Behavior | Wave 1 Disposition | Retained Logic Location |
| :--- | :--- | :--- | :--- | :--- |
| **Booking Hold Logic** | `services/api/src/bookings/bookings.service.ts` | Concurrency-safe room/cab hold with 10% fee calculation. | Disabled on public API. | Preserved internally as `legacyCreateHoldInternal()`. |
| **Booking Confirm Logic** | `services/api/src/bookings/bookings.service.ts` | Confirms booking upon cryptographic signature verification. | Disabled on public API. | Preserved internally as `legacyConfirmBookingInternal()`. |
| **Booking Hold Controller** | `services/api/src/bookings/bookings.controller.ts` | Handled `POST /bookings/hold`. | Returns HTTP 400 `BadRequestException`. | Controller method body updated. |
| **Booking Confirm Controller** | `services/api/src/bookings/bookings.controller.ts` | Handled `POST /bookings/confirm`. | Returns HTTP 400 `BadRequestException`. | Controller method body updated. |
| **Customer Payment Order** | `services/api/src/payments/payments.controller.ts` | Generated Razorpay order for booking IDs. | Returns HTTP 400 `BadRequestException`. | Controller method body updated. |
| **Customer Payment Verify** | `services/api/src/payments/payments.controller.ts` | Verified Razorpay signature for bookings. | Returns HTTP 400 `BadRequestException`. | Controller method body updated. |
| **Payment Webhook Auto-Confirm** | `services/api/src/payments/payments.service.ts` | Auto-confirmed booking state on `payment.captured`. | Disabled; logs warning event without DB mutation. | Webhook logic preserved in service. |
| **On-Demand Ride Booking** | `services/api/src/local-rides/local-rides.service.ts` | Created `Ride` record with estimated vehicle fare. | Disabled on public API. | Preserved internally as `legacyCreateRideBookingInternal()`. |
| **Ride Acceptance & OTP** | `services/api/src/local-rides/local-rides.service.ts` | Assigned driver and generated 4-digit OTP PIN. | Disabled on public API. | Preserved internally as `legacyAcceptRideInternal()`. |
| **Ride Gateway Dispatch** | `services/api/src/local-rides/local-rides.gateway.ts` | Listened to `request_ride`, `driver_online`, `accept_ride`. | Intercepts all events and returns disabled status. | Event methods maintained for protocol compatibility. |
| **Web Dispatch Interface** | `apps/traveller-web/src/app/local-rides/page.tsx` | Interactive socket dispatch loop with waiting spinner. | Replaced with responsive directory-only interface. | Documented in git history; replaced by directory cards. |
| **Mobile Booking Holds** | `apps/traveller-mobile/src/services/api.service.ts` | `createBookingHold` calling `/bookings/hold`. | Deprecated; returns direct error response. | Method preserved with `@deprecated` annotation. |
| **Database `Booking` Model** | `services/api/prisma/schema.prisma` | Stores customer booking hold records. | **PRESERVED IN FULL**; no schema changes in Wave 1. | Database model intact. |
| **Database `Ride` Model** | `services/api/prisma/schema.prisma` | Stores on-demand ride records and OTP PINs. | **PRESERVED IN FULL**; no schema changes in Wave 1. | Database model intact. |

## 3. Preservation Rationale
1. **Historical Audit**: Preserves existing database records from being orphaned or corrupted.
2. **Non-Destructive Execution**: Guarantees zero downtime or database schema locks.
3. **Partner Subscription Preparation**: Preserves underlying payment infrastructure for future Wave/Phase partner subscription integration without mixing customer booking flows.
