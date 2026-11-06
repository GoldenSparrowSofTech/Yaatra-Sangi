export type BookingType = 'HOTEL' | 'CAB' | 'TOUR' | 'PACKAGE';

export class CreateBookingHoldDto {
  type: BookingType;
  resourceId: string; // e.g. hotel ID, taxi slug, tour ID
  startDate: string;  // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  guestCount?: number;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
}

