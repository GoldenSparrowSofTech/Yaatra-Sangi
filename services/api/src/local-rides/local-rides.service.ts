import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class LocalRidesService {
  constructor(private prisma: PrismaService) {}

  async createRideBooking(data: { userId: string; pickup: string; drop: string; vehicleType: string }) {
    // Basic price estimation mock based on vehicle type
    let estimatedFare = 50;
    if (data.vehicleType === 'auto') estimatedFare = 80;
    if (data.vehicleType === 'cab') estimatedFare = 150;

    return this.prisma.ride.create({
      data: {
        userId: data.userId || "dummy-user-id", // In real app, ensure valid userId
        pickup: data.pickup,
        drop: data.drop,
        vehicleType: data.vehicleType,
        price: estimatedFare,
        status: 'REQUESTED',
      },
    });
  }

  async acceptRide(bookingId: string, driverId: string) {
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
