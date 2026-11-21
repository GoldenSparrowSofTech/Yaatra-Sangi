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
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      if (process.env.NODE_ENV === 'production') {
        throw new BadRequestException('Payment webhook secret is not configured in production');
      }
    }
    const secret = webhookSecret || 'dev_test_webhook_secret';
    const isValid = await this.razorpayProvider.verifyWebhookSignature(
      rawBody,
      signature,
      secret,
    );

    if (!isValid) {
      throw new BadRequestException('Invalid webhook signature');
    }

    const event = eventData.event;
    this.logger.log(`Processing verified payment webhook event: ${event}`);

    // WAVE 1: Customer booking auto-confirmation via payment webhook is disabled.
    // Bookings and payments occur directly between customer and business partner outside platform.
    if (event === 'payment.captured' || event === 'order.paid') {
      const orderId = eventData.payload?.payment?.entity?.order_id;
      if (orderId) {
        this.logger.warn(
          `Received payment webhook event for order ${orderId}, but customer booking auto-confirmation is disabled per direct-connection marketplace policy.`,
        );
      }
    }

    return { received: true };
  }

  async refund(paymentId: string, amount?: number, reason?: string) {
    return this.razorpayProvider.refund({ paymentId, amount, reason });
  }
}

