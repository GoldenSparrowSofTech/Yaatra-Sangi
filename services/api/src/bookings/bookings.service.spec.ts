import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingsService } from './bookings.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { ConflictException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('BookingsService', () => {
  let service: BookingsService;
  let mockPrisma: any;
  let mockPayments: any;

  beforeEach(() => {
    mockPrisma = {
      hotel: {
        findUnique: vi.fn(),
      },
      taxi: {
        findFirst: vi.fn(),
      },
      package: {
        findFirst: vi.fn(),
      },
      booking: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn().mockImplementation(async (callback) => {
        return callback(mockPrisma);
      }),
    };

    mockPayments = {
      createOrder: vi.fn().mockResolvedValue({
        orderId: 'order_test_123',
        amount: 5900,
        currency: 'INR',
        provider: 'MOCK',
      }),
      verifyPayment: vi.fn().mockResolvedValue({
        isValid: true,
      }),
    };

    service = new BookingsService(
      mockPrisma as unknown as PrismaService,
      mockPayments as unknown as PaymentsService,
    );
  });

  describe('WAVE 1: Disabled Customer Booking Endpoints', () => {
    it('should reject customer booking-hold creation with BadRequestException per marketplace policy', async () => {
      await expect(
        service.createHold('user-1', {
          type: 'HOTEL',
          resourceId: '1',
          startDate: '2026-12-01',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject customer booking confirmation with BadRequestException per marketplace policy', async () => {
      await expect(
        service.confirmBooking('user-1', {
          bookingId: 'book-1',
          orderId: 'order_123',
          paymentId: 'pay_123',
          signature: 'sig_123',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Preserved Legacy Hold & Confirmation Logic', () => {
    it('should maintain legacyCreateHoldInternal for historical reference', async () => {
      mockPrisma.hotel.findUnique.mockResolvedValue({
        id: 1,
        name: 'Taj Exotica',
        price: 10000,
      });
      mockPrisma.booking.findMany.mockResolvedValue([]);
      mockPrisma.booking.create.mockImplementation(async (args: any) => ({
        id: 'book-uuid-1',
        ...args.data,
      }));

      const result = await service.legacyCreateHoldInternal('user-1', {
        type: 'HOTEL',
        resourceId: '1',
        startDate: '2026-12-01',
        endDate: '2026-12-03',
      });

      expect(result).toBeDefined();
      expect(result.status).toBe('HELD');
      expect(result.financialSnapshot.baseAmount).toBe(10000);
      expect(result.financialSnapshot.platformFee).toBe(1000);
      expect(result.totalAmount).toBe(12980);
    });

    it('should maintain legacyConfirmBookingInternal for historical reference', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'book-1',
        userId: 'user-1',
        status: 'HELD',
        holdExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });
      mockPrisma.booking.update.mockResolvedValue({
        id: 'book-1',
        status: 'CONFIRMED',
        updatedAt: new Date(),
      });

      const result = await service.legacyConfirmBookingInternal('user-1', {
        bookingId: 'book-1',
        orderId: 'order_123',
        paymentId: 'pay_123',
        signature: 'valid_sig',
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe('CONFIRMED');
    });
  });

  describe('IDOR & Resource Authorization (SEC-07)', () => {
    it('should allow owner to access their own booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'book-100',
        userId: 'owner-user',
        totalAmount: 5000,
      });

      const result = await service.getBooking('owner-user', 'book-100');
      expect(result).toBeDefined();
      expect(result.id).toBe('book-100');
    });

    it('should throw ForbiddenException when user attempts to access another tenant booking (IDOR attempt)', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'book-200',
        userId: 'victim-user',
        totalAmount: 9000,
      });

      await expect(service.getBooking('attacker-user', 'book-200')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when booking does not exist', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);

      await expect(service.getBooking('user-1', 'nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });
});

