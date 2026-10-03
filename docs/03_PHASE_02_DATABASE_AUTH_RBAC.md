# Phase 02 — Database, Auth, Users & RBAC

## Core models
Auth: User, Role, Permission, UserRole, RolePermission, RefreshToken, OtpVerification.
Location: Country, State, City, Destination, Place.
Trip: Trip, TripStop, TripLeg, TripRouteVersion, TripExpense, TripDay, TripDayStop.
Hotel: Hotel, RoomType, Room, RoomInventory, HotelMedia, RoomMedia, Amenity, HotelAmenity.
Taxi: TaxiCompany, VehicleType, Vehicle, VehicleMedia, Driver, TaxiPricing, TaxiServiceArea.
Finance: HotelBooking, HotelBookingRoom, TaxiBooking, Payment, Commission, Refund.
UX/Security: Review, Wishlist, Notification, SupportTicket, Document, AuditLog.

## Auth
Register, login, JWT access/refresh, refresh rotation, logout/revocation, OTP, forgot/reset password, optional OAuth.

Use Argon2/bcrypt. Access tokens short-lived. Refresh tokens revocable.

## RBAC
Examples:
`hotel.create`, `hotel.room.create`, `hotel.booking.view`, `taxi.vehicle.edit`, `admin.hotel.approve`.

## Security
DTO validation, CORS, rate limits, secure headers, authorization, tenant isolation, audit logs, no secrets in Git.

Exit: clean user can register/login/refresh/logout and access only authorized resources.
