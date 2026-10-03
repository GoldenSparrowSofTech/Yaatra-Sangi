# Phase 06 — Hotel Search, Availability & Booking

## Search
Default radius: **10 km**.
Use:
`ST_DWithin(hotel.location, destination.location, 10000)`

Return hotel + distance + available room types + lowest available price.

## Availability
Inputs: hotel, dates, adults, children, rooms. Validate every night.

## Booking
SEARCH → HOLD → PENDING_PAYMENT → CONFIRMED → COMPLETED.
Terminal: CANCELLED, EXPIRED, REFUNDED.

Temporary hold: initially 15 minutes, configurable.

Transaction:
1. SELECT inventory FOR UPDATE
2. verify
3. decrement
4. create booking
5. create booking-room
6. save price snapshot
7. commit

Cancellation restores inventory when applicable.
Expiry worker releases inventory and marks EXPIRED.
Booking stores price/tax/fee/discount/commission/final snapshots.

Exit: concurrency tests prove no overselling.
