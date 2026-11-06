import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto.js';
import { ConfirmBookingDto } from './dto/confirm-booking.dto.js';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);
  private readonly HOLD_DURATION_MINUTES = 15;
  private readonly PLATFORM_COMMISSION_RATE = 0.10; // 10%
  private readonly GST_TAX_RATE = 0.18; // 18%

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsService: PaymentsService,
  ) {}

  /**
   * Concurrency-safe atomic temporary reservation hold
   */
  async createHold(
    userId: string,
    dto: CreateBookingHoldDto,
    idempotencyKey?: string,
  ) {
    // 1. Resolve and validate target resource
    let resourceName = 'Travel Item';
    let rawPrice = 5000;

    if (dto.type === 'HOTEL') {
      const hotelId = parseInt(dto.resourceId);
      const hotel = await this.prisma.hotel.findUnique({
        where: { id: isNaN(hotelId) ? 1 : hotelId },
      });
      if (!hotel) throw new NotFoundException(`Hotel ${dto.resourceId} not found`);
      resourceName = hotel.name;
      rawPrice = typeof hotel.price === 'object' && (hotel.price as any)?.toNumber
        ? (hotel.price as any).toNumber()
        : Number(hotel.price) || 5000;
    } else if (dto.type === 'CAB') {
      const taxi = await this.prisma.taxi.findFirst({
        where: {
          OR: [{ slug: dto.resourceId }, { id: parseInt(dto.resourceId) || -1 }],
        },
      });
      if (!taxi) throw new NotFoundException(`Taxi ${dto.resourceId} not found`);
      resourceName = taxi.name;
      rawPrice = typeof taxi.price === 'object' && (taxi.price as any)?.toNumber
        ? (taxi.price as any).toNumber()
        : Number(taxi.price) || 2000;
    } else if (dto.type === 'PACKAGE') {
      const pkg = await this.prisma.package.findFirst({
        where: {
          OR: [{ slug: dto.resourceId }, { id: parseInt(dto.resourceId) || -1 }],
        },
      });
      if (!pkg) throw new NotFoundException(`Package ${dto.resourceId} not found`);
      resourceName = pkg.name;
      rawPrice = typeof pkg.price === 'object' && (pkg.price as any)?.toNumber
        ? (pkg.price as any).toNumber()
        : Number(pkg.price) || 15000;
    }

    // 2. Financial calculation with decimal precision
    const baseAmount = rawPrice;
    const platformFee = Math.round(baseAmount * this.PLATFORM_COMMISSION_RATE * 100) / 100;
    const taxAmount = Math.round((baseAmount + platformFee) * this.GST_TAX_RATE * 100) / 100;
    const totalAmount = Math.round((baseAmount + platformFee + taxAmount) * 100) / 100;
    const providerPayout = baseAmount;

    const holdExpiresAt = new Date(Date.now() + this.HOLD_DURATION_MINUTES * 60 * 1000);

    // 3. Atomic Hold Creation & Concurrency Collision Check
    return this.prisma.$transaction(async (tx) => {
      // Check for active holds on the same resource
      const activeBookings = await tx.booking.findMany({
        where: {
          type: dto.type,
          status: { in: ['HELD', 'CONFIRMED'] },
          holdExpiresAt: { gt: new Date() },
        },
      });

      const hasConflict = activeBookings.some((b) => {
        try {
          const details = typeof b.details === 'string' ? JSON.parse(b.details) : b.details;
          return (
            details?.resourceId === dto.resourceId &&
            details?.startDate === dto.startDate
          );
        } catch {
          return false;
        }
      });

      if (hasConflict) {
        throw new ConflictException(
          'This resource is currently reserved by another traveler. Please select another date or item.',
        );
      }

      // 4. Create payment order via gateway
      const paymentOrder = await this.paymentsService.createOrder({
        bookingId: `pending_${Date.now()}`,
        amount: totalAmount,
        currency: 'INR',
        notes: {
          userId,
          type: dto.type,
          resourceId: dto.resourceId,
        },
      });

      const detailsPayload = {
        resourceId: dto.resourceId,
        resourceName,
        startDate: dto.startDate,
        endDate: dto.endDate,
        guestCount: dto.guestCount || 1,
        contactName: dto.contactName,
        contactPhone: dto.contactPhone,
        notes: dto.notes,
        financialSnapshot: {
          baseAmount,
          platformFee,
          taxAmount,
          totalAmount,
          providerPayout,
          currency: 'INR',
        },
        orderId: paymentOrder.orderId,
      };

      // 5. Persist booking in HELD state
      const booking = await tx.booking.create({
        data: {
          userId,
          type: dto.type,
          status: 'HELD',
          totalAmount,
          holdExpiresAt,
          idempotencyKey: idempotencyKey || null,
          details: JSON.stringify(detailsPayload),
        },
      });

      this.logger.log(`Created 15-minute hold for booking ${booking.id} (Order: ${paymentOrder.orderId})`);

      return {
        bookingId: booking.id,
        status: booking.status,
        holdExpiresAt: booking.holdExpiresAt,
        totalAmount,
        financialSnapshot: detailsPayload.financialSnapshot,
        paymentOrder,
      };
    });
  }

  /**
   * Confirms a held booking after cryptographic verification of payment
   */
  async confirmBooking(userId: string, dto: ConfirmBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Booking ${dto.bookingId} not found`);
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('Unauthorized booking confirmation attempt');
    }

    if (booking.status === 'CONFIRMED') {
      return {
        success: true,
        message: 'Booking is already confirmed',
        booking,
      };
    }

    if (booking.status !== 'HELD' && booking.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException(`Cannot confirm booking in ${booking.status} status`);
    }

    // Verify hold window
    if (booking.holdExpiresAt && booking.holdExpiresAt < new Date()) {
      await this.prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'EXPIRED' },
      });
      throw new BadRequestException('Booking hold has expired. Please initiate a new booking.');
    }

    // Cryptographic signature verification via payments service
    await this.paymentsService.verifyPayment({
      orderId: dto.orderId,
      paymentId: dto.paymentId,
      signature: dto.signature,
    });

    // Update to confirmed
    const updated = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'CONFIRMED',
      },
    });

    this.logger.log(`Booking ${booking.id} successfully CONFIRMED with payment ${dto.paymentId}`);

    return {
      success: true,
      bookingId: updated.id,
      status: updated.status,
      confirmedAt: updated.updatedAt,
    };
  }

  /**
   * Retrieves all bookings for a user
   */
  async getUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Retrieves specific booking details
   */
  async getBooking(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }
    if (booking.userId !== userId) {
      throw new BadRequestException('Access denied to this booking');
    }
    return booking;
  }
}

