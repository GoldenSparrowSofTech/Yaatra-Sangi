import { Injectable, Error } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocalRidesService {
  constructor(private prisma: PrismaService) {}

  async createRideBooking(data: { userId: string; pickup: string; drop: string; vehicleType: string }) {
    // Basic price estimation mock based on vehicle type
    let estimatedFare = 50;
    if (data.vehicleType === 'auto') estimatedFare = 80;
    if (data.vehicleType === 'cab') estimatedFare = 150;

    return this.prisma.localRideBooking.create({
      data: {
        userId: data.userId || "dummy-user-id", // In real app, ensure valid userId
        pickupAddress: data.pickup,
        dropAddress: data.drop,
        vehicleType: data.vehicleType,
        estimatedFare,
        status: 'SEARCHING',
      },
    });
  }

  async acceptRide(bookingId: string, driverId: string) {
    // Transaction to ensure first-come-first-serve
    return this.prisma.$transaction(async (tx) => {
      // 1. Fetch current booking status
      const booking = await tx.localRideBooking.findUnique({
        where: { id: bookingId },
      });

      if (!booking) {
        throw new Error('Booking not found');
      }

      // 2. Check if already accepted
      if (booking.status !== 'SEARCHING') {
        throw new Error('Ride already accepted by someone else');
      }

      // 3. Find the driver's LocalRide profile
      const localRideProfile = await tx.localRide.findFirst({
        where: { ownerId: driverId },
      });

      // 4. Generate 4 digit OTP PIN
      const otpPin = Math.floor(1000 + Math.random() * 9000).toString();

      // 5. Update the booking to ACCEPTED
      const updatedBooking = await tx.localRideBooking.update({
        where: { id: bookingId },
        data: {
          status: 'ACCEPTED',
          assignedRideId: localRideProfile?.id,
          otpPin,
        },
        include: {
          assignedRide: true,
          user: {
            select: { name: true, contactPhone: true } // Assuming User has contactPhone (might need adjusting)
          }
        }
      });

      return updatedBooking;
    });
  }
}
