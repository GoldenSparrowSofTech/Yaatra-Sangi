# Phase 07 — Taxi Company, Vehicles, Drivers & Pricing

Operator flow:
Company → Vehicles → Drivers → Service Areas → Pricing → Availability → Booking → Driver assignment → Trip.

Vehicle examples:
Sedan, SUV, Ertiga, Innova, Tempo Traveller.

Vehicle:
registration, type, make/model, year, seats, luggage, AC, photos, documents, status.

Driver:
name, phone, license/documents, availability, company, status.

Pricing:
per km, minimum fare, toll, parking, driver allowance, night/interstate/waiting charges, fixed trip price.

Taxi service area uses polygons/cities/destination coverage. Search uses pickup/service area + availability.

Booking states:
HOLD, PENDING, CONFIRMED, DRIVER_ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED.

Exit: traveller can compare/book; operator/driver can manage.
