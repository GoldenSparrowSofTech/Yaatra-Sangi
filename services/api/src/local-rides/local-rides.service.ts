import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface LocalDriverDirectoryItem {
  id: string;
  driverName: string;
  vehicleType: 'Auto' | 'Bike' | 'Cab';
  vehicleModel: string;
  vehicleNumber: string;
  rating: number;
  reviews: number;
  baseFare: number;
  perKmRate: number;
  city: string;
  contactPhone: string;
  available: boolean;
}

const LOCAL_DRIVERS_DIRECTORY: LocalDriverDirectoryItem[] = [
  {
    id: '1',
    driverName: 'Ramesh Bhai Patel',
    vehicleType: 'Auto',
    vehicleModel: 'Bajaj RE Compact',
    vehicleNumber: 'GJ-03-AX-1234',
    rating: 4.9,
    reviews: 128,
    baseFare: 30,
    perKmRate: 12,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876543210',
    available: true,
  },
  {
    id: '2',
    driverName: 'Suresh Kumar',
    vehicleType: 'Bike',
    vehicleModel: 'Hero Splendor Plus',
    vehicleNumber: 'GJ-03-BK-5678',
    rating: 4.8,
    reviews: 94,
    baseFare: 20,
    perKmRate: 8,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876543211',
    available: true,
  },
  {
    id: '3',
    driverName: 'Vikram Singh',
    vehicleType: 'Cab',
    vehicleModel: 'Maruti WagonR (AC)',
    vehicleNumber: 'GJ-03-TC-9012',
    rating: 4.9,
    reviews: 210,
    baseFare: 50,
    perKmRate: 14,
    city: 'Rajkot, Gujarat',
    contactPhone: '+919876543212',
    available: true,
  },
];

@Injectable()
export class LocalRidesService {
  constructor(private prisma: PrismaService) {}

  /**
   * WAVE 1: ADR-001 Canonical Local Rides Directory
   * Direct connection directory query for permanent-free local ride providers.
   */
  async getDriversDirectory(city?: string, vehicleType?: string): Promise<LocalDriverDirectoryItem[]> {
    let drivers = [...LOCAL_DRIVERS_DIRECTORY];
    if (city) {
      drivers = drivers.filter((d) => d.city.toLowerCase().includes(city.toLowerCase()));
    }
    if (vehicleType && vehicleType.toLowerCase() !== 'all') {
      drivers = drivers.filter((d) => d.vehicleType.toLowerCase() === vehicleType.toLowerCase());
    }
    return drivers;
  }

  /**
   * WAVE 1: On-demand ride dispatch disabled per ADR-001.
   */
  async createRideBooking(data: { userId: string; pickup: string; drop: string; vehicleType: string }) {
    throw new BadRequestException(
      'On-demand ride dispatch is disabled per ADR-001. Please use the driver directory to contact drivers directly.',
    );
  }

  /**
   * PRESERVED LEGACY: Dispatch ride booking logic preserved for historical reference.
   */
  async legacyCreateRideBookingInternal(data: { userId: string; pickup: string; drop: string; vehicleType: string }) {
    // Basic price estimation mock based on vehicle type
    let estimatedFare = 50;
    if (data.vehicleType === 'auto') estimatedFare = 80;
    if (data.vehicleType === 'cab') estimatedFare = 150;

    return this.prisma.ride.create({
      data: {
        userId: data.userId || "dummy-user-id",
        pickup: data.pickup,
        drop: data.drop,
        vehicleType: data.vehicleType,
        price: estimatedFare,
        status: 'REQUESTED',
      },
    });
  }

  /**
   * WAVE 1: Ride acceptance disabled per ADR-001.
   */
  async acceptRide(bookingId: string, driverId: string) {
    throw new BadRequestException(
      'Ride acceptance and dispatch are disabled per ADR-001 directory-only policy.',
    );
  }

  /**
   * PRESERVED LEGACY: Internal ride acceptance logic preserved for historical reference.
   */
  async legacyAcceptRideInternal(bookingId: string, driverId: string) {
    // Transaction to ensure first-come-first-serve
    return this.prisma.$transaction(async (tx: any) => {
      // 1. Fetch current booking status
      const booking = await tx.ride.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new BadRequestException('Booking not found');
      }

      // 2. Check if already accepted
      if (booking.status !== 'REQUESTED') {
        throw new BadRequestException('Ride already accepted by someone else');
      }

      // 3. Generate 4 digit OTP PIN
      const otpPin = Math.floor(1000 + Math.random() * 9000).toString();

      // 4. Update the booking to ACCEPTED
      const updatedBooking = await tx.ride.update({
        where: { id: bookingId },
        data: {
          status: 'ACCEPTED',
          driverId,
          otpPin,
        }
      });

      return updatedBooking;
    });
  }
}
