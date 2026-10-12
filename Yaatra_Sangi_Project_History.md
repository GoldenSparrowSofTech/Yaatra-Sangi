# Yaatra-Sangi (યાત્રા-સંગી) - Project History & Specification

આ ડોક્યુમેન્ટ ભવિષ્યમાં AI (જેમ કે Antigravity) ને પ્રોજેક્ટનું બેકગ્રાઉન્ડ સમજાવવા માટે બનાવવામાં આવ્યું છે. જ્યારે પણ નવું કામ શરૂ કરવું હોય, ત્યારે AI ને આ ડોક્યુમેન્ટ વાંચવા આપવું.

## ૧. Project Architecture (આર્કિટેક્ચર)
- **Repo Type:** Turborepo Monorepo (`d:\Website\travelPartner`)
- **Frontend (Web):** Next.js (React) - `apps/traveller-web` 
- **Frontend (Mobile):** React Native (Expo) - `apps/traveller-mobile`
- **Backend (API):** NestJS - `services/api`
- **Database:** Prisma (PostgreSQL / SQLite)

## ૨. UI/UX & Branding (ડિઝાઇન)
- **Theme:** Modern Travel UI, clean layout, vibrant colors for destinations, professional dashboard for drivers/hotels.
- **Icons & Branding:** Name of the app is "Yaatra-Sangi". 

## ૩. Features Completed (થઈ ગયેલું કામ)
1. **Frontend Layout:** 
   - Basic setup for destinations, local-rides, and tour-packages in Web app.
   - React Native mobile app setup.
2. **Backend Services:** 
   - Taxi service API initialized (`services/api/src/taxis`).

## ૪. Future Roadmap / Next Steps (આગળ કરવાનું બાકી કામ)
1. **Authentication System:**
   - Driver, Hotel Owner, and Traveller registration.
2. **Booking Module:** 
   - Taxi booking flow with pricing estimation.
   - Hotel room booking system.
3. **Database Schema Setup:**
   - Define schema for Users, Rides, Bookings, Hotels.
4. **Partner Dashboard:**
   - Driver and Hotel owner earning and request management.

---
**AI Instruction for Future Sessions:** 
When the user uploads or refers to this document, read all the sections above to instantly understand the current state of the 'Yaatra-Sangi' project. Resume work from the "Future Roadmap" section based on the user's prompt.
