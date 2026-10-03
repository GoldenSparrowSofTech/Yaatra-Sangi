# Phase 04 — Trip, Map & Day-wise Itinerary

Flow:
Create Trip → Add Destinations → Optimize → Review → Map → Generate Itinerary → Adjust → Hotel.

Trip states:
DRAFT, PLANNING, READY, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED.

Stop states:
PLANNED, VISITED, SKIPPED.

Leg states:
PLANNED, IN_PROGRESS, COMPLETED, CANCELLED.

Map:
- route polyline
- numbered markers
- distance/duration
- day grouping

Itinerary:
- day/date
- destination
- arrival/departure estimates
- driving time
- stay
- activities

Changing route creates a new route version.

Exit: same trip data works consistently on web/mobile through API.
