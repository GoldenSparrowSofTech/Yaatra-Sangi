# Wave 1: API Endpoint Changes

## 1. Endpoint Status Register

| Route | Method | Original Status | Wave 1 Status | Response Code & Payload |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/bookings/hold` | `POST` | Active | **DISABLED** | `400 Bad Request`<br>`{ "statusCode": 400, "message": "Direct-connect marketplace: Customer booking holds are disabled per business policy. Connect directly with the business provider via Call or WhatsApp." }` |
| `/api/v1/bookings/confirm` | `POST` | Active | **DISABLED** | `400 Bad Request`<br>`{ "statusCode": 400, "message": "Direct-connect marketplace: Customer booking checkout is disabled. Bookings, confirmations, and payments are handled directly with providers." }` |
| `/api/v1/payments/create-order` | `POST` | Active | **DISABLED** | `400 Bad Request`<br>`{ "statusCode": 400, "message": "Customer booking payments are disabled. YaatraSangi is a direct-connection marketplace without customer booking checkout." }` |
| `/api/v1/payments/verify` | `POST` | Active | **DISABLED** | `400 Bad Request`<br>`{ "statusCode": 400, "message": "Customer booking payment verification is disabled. Transactions are handled directly with providers." }` |
| `/api/v1/local-rides` | `GET` | Non-existent | **ACTIVE** | `200 OK`<br>Returns array of local drivers: `[{ id, driverName, vehicleType, vehicleModel, vehicleNumber, rating, reviews, baseFare, perKmRate, city, contactPhone, available }]` |
| `/api/v1/bookings` | `GET` | Active | **ACTIVE** | `200 OK`<br>User booking history retained for auditability. |
| `/api/v1/bookings/:id` | `GET` | Active | **ACTIVE** | `200 OK`<br>Booking record detail retained for auditability. |
| `/api/v1/bookings/cleanup-expired` | `POST` | Active | **ACTIVE** | `200 OK`<br>Administrative expired hold cleanup retained for admin users. |
| `/api/v1/hotels` | `GET` | Active | **ACTIVE** | `200 OK`<br>Public hotel discovery unaffected. |
| `/api/v1/taxis` | `GET` | Active | **ACTIVE** | `200 OK`<br>Public taxi discovery unaffected. |
| `/api/v1/restaurants` | `GET` | Active | **ACTIVE** | `200 OK`<br>Public restaurant discovery unaffected. |
| `/api/v1/packages` | `GET` | Active | **ACTIVE** | `200 OK`<br>Public package discovery unaffected. |

## 2. WebSocket Event Status Register (`LocalRidesGateway`)

| Event Name | Direction | Original Status | Wave 1 Status | Event Response Payload |
| :--- | :--- | :--- | :--- | :--- |
| `request_ride` | Client -> Server | Active Dispatch | **DISABLED** | `{ event: 'ride_dispatch_disabled', data: { success: false, message: 'On-demand ride dispatch is disabled per ADR-001. Please browse driver directory and contact directly.' } }` |
| `driver_online` | Client -> Server | Online Tracking | **DISABLED** | `{ event: 'driver_online_disabled', data: { success: false, message: 'Driver online dispatch status is disabled. YaatraSangi operates a direct-connect directory only.' } }` |
| `accept_ride` | Client -> Server | Driver Assignment | **DISABLED** | `{ event: 'ride_accept_disabled', data: { success: false, message: 'Ride acceptance and dispatch are disabled per ADR-001 directory policy.' } }` |
| `ride_requested` | Server -> Client | Broadcast | **DISABLED** | Event emission removed. |
| `ride_status_updated_*` | Server -> Client | Broadcast | **DISABLED** | Event emission removed. |
