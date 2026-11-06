import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider.js';
import {
  CreateOrderInput,
  CreateOrderResult,
  VerifyPaymentInput,
  VerifyResult,
} from './interfaces/payment-gateway.interface.js';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayProvider: RazorpayPaymentProvider,
  ) {}

  async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    return this.razorpayProvider.createOrder(input);
  }

  async verifyPayment(input: VerifyPaymentInput): Promise<VerifyResult> {
    const result = await this.razorpayProvider.verifyPayment(input);
    if (!result.isValid) {
      throw new BadRequestException(result.error || 'Payment signature verification failed');
    }
    return result;
  }

  async processWebhook(rawBody: string, signature: string, eventData: any) {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'test_webhook_secret';
    const isValid = await this.razorpayProvider.verifyWebhookSignature(
      rawBody,
      signature,
      webhookSecret,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = eventData.event;
    this.logger.log(`Processing verified payment webhook event: ${event}`);

    if (event === 'payment.captured' || event === 'order.paid') {
      const orderId = eventData.payload?.payment?.entity?.order_id;
      if (orderId) {
        // Find booking by orderId in details JSON
        const bookings = await this.prisma.booking.findMany({
          where: {
            status: { in: ['HELD', 'PENDING_PAYMENT'] },
          },
        });

        const matched = bookings.find((b) => {
          try {
            const details = typeof b.details === 'string' ? JSON.parse(b.details) : b.details;
            return details?.orderId === orderId;
          } catch {
            return false;
          }
        });

        if (matched) {
          await this.prisma.booking.update({
            where: { id: matched.id },
            data: { status: 'CONFIRMED' },
          });
          this.logger.log(`Booking ${matched.id} automatically CONFIRMED via payment webhook`);
        }
      }
    }

    return { received: true };
  }

  async refund(paymentId: string, amount?: number, reason?: string) {
    return this.razorpayProvider.refund({ paymentId, amount, reason });
  }
}

