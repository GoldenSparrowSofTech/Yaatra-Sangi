# Phase 05 — Hotel Owner Platform

Owner flow:
Signup → Hotel → Media → Amenities → Room Types → Rooms → Inventory → Pricing → Approval → Searchable.

Hotel states:
DRAFT, PENDING_REVIEW, APPROVED, REJECTED, SUSPENDED, INACTIVE.

Hotel:
name, description, address, destination, coordinates, phone/email, check-in/out, amenities, policies, photos.

Room type:
name, description, capacity, bed, amenities, cancellation policy, base price.

Inventory:
roomTypeId + date unique; totalRooms, availableRooms, price.

Media:
S3 object key, URL, MIME, size, ordering, alt text.

Admin can approve/reject/request changes/suspend. Audit all status changes.

Exit: provider can fully onboard and maintain hotel data.
