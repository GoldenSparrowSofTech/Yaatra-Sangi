import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingsService } from './bookings.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaymentsService } from '../payments/payments.service.js';
import { ConflictException, BadRequestException } from '@nestjs/common';

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

  it('should create a 15-minute temporary hold with decimal financial breakdown', async () => {
    mockPrisma.hotel.findUnique.mockResolvedValue({
      id: 1,
      name: 'Taj Exotica',
      price: 10000,
    });

    mockPrisma.booking.findMany.mockResolvedValue([]); // No conflicting active holds

    mockPrisma.booking.create.mockImplementation(async (args: any) => ({
      id: 'book-uuid-1',
      ...args.data,
    }));

    const result = await service.createHold('user-1', {
      type: 'HOTEL',
      resourceId: '1',
      startDate: '2026-12-01',
      endDate: '2026-12-03',
    });

    expect(result).toBeDefined();
    expect(result.status).toBe('HELD');
    expect(result.financialSnapshot.baseAmount).toBe(10000);
    expect(result.financialSnapshot.platformFee).toBe(1000); // 10%
    expect(result.financialSnapshot.taxAmount).toBe(1980);   // 18% of 11000
    expect(result.totalAmount).toBe(12980);
    expect(result.paymentOrder.orderId).toBe('order_test_123');
  });

  it('should throw ConflictException if another active hold exists on the same resource and date', async () => {
    mockPrisma.hotel.findUnique.mockResolvedValue({
      id: 1,
      name: 'Taj Exotica',
      price: 10000,
    });

    // Simulating an existing active hold for hotel 1 on 2026-12-01
    mockPrisma.booking.findMany.mockResolvedValue([
      {
        id: 'existing-hold',
        type: 'HOTEL',
        status: 'HELD',
        holdExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        details: JSON.stringify({ resourceId: '1', startDate: '2026-12-01' }),
      },
    ]);

    await expect(
      service.createHold('user-2', {
        type: 'HOTEL',
        resourceId: '1',
        startDate: '2026-12-01',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('should confirm booking after valid payment verification', async () => {
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: 'book-1',
      userId: 'user-1',
      status: 'HELD',
      holdExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // Active hold
    });

    mockPrisma.booking.update.mockResolvedValue({
      id: 'book-1',
      status: 'CONFIRMED',
      updatedAt: new Date(),
    });

    const result = await service.confirmBooking('user-1', {
      bookingId: 'book-1',
      orderId: 'order_123',
      paymentId: 'pay_123',
      signature: 'valid_sig',
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe('CONFIRMED');
    expect(mockPayments.verifyPayment).toHaveBeenCalled();
  });

  it('should reject confirmation if hold has expired', async () => {
    mockPrisma.booking.findUnique.mockResolvedValue({
      id: 'book-expired',
      userId: 'user-1',
      status: 'HELD',
      holdExpiresAt: new Date(Date.now() - 5 * 60 * 1000), // Expired 5 mins ago
    });

    await expect(
      service.confirmBooking('user-1', {
        bookingId: 'book-expired',
        orderId: 'order_123',
        paymentId: 'pay_123',
        signature: 'valid_sig',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});

