import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentsService } from './payments.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider.js';
import { MockPaymentProvider } from './providers/mock-payment.provider.js';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let mockPrisma: any;
  let razorpayProvider: RazorpayPaymentProvider;

  beforeEach(() => {
    mockPrisma = {
      booking: {
        findMany: vi.fn(),
        update: vi.fn(),
      },
    };

    const mockProvider = new MockPaymentProvider();
    razorpayProvider = new RazorpayPaymentProvider(mockProvider);
    service = new PaymentsService(mockPrisma as unknown as PrismaService, razorpayProvider);
  });

  it('should create payment order through provider', async () => {
    const order = await service.createOrder({
      bookingId: 'book-1',
      amount: 5900,
      currency: 'INR',
    });

    expect(order).toBeDefined();
    expect(order.orderId).toContain('order_');
    expect(order.amount).toBe(5900);
    expect(order.currency).toBe('INR');
  });

  it('should verify payment successfully with valid signature', async () => {
    const result = await service.verifyPayment({
      orderId: 'order_123',
      paymentId: 'pay_456',
      signature: 'valid_mock_signature',
    });

    expect(result.isValid).toBe(true);
  });

  it('should throw BadRequestException if signature is invalid', async () => {
    await expect(
      service.verifyPayment({
        orderId: 'order_123',
        paymentId: 'pay_456',
        signature: 'invalid_sig',
      }),
    ).rejects.toThrow();
  });
});

