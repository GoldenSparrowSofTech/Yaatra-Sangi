import {
  Controller,
  Post,
  Body,
  Headers,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(
    @Body() body: { bookingId: string; amount: number; currency?: string },
    @CurrentUser('id') userId: string,
  ) {
    if (!body.bookingId || !body.amount) {
      throw new BadRequestException('bookingId and amount are required');
    }

    return this.paymentsService.createOrder({
      bookingId: body.bookingId,
      amount: body.amount,
      currency: body.currency || 'INR',
      notes: { userId },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyPayment(
    @Body() body: { orderId: string; paymentId: string; signature: string },
  ) {
    if (!body.orderId || !body.paymentId || !body.signature) {
      throw new BadRequestException('orderId, paymentId, and signature are required');
    }

    return this.paymentsService.verifyPayment(body);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Body() eventData: any,
  ) {
    if (!signature) {
      throw new BadRequestException('Missing x-razorpay-signature header');
    }

    const rawBody = JSON.stringify(eventData);
    return this.paymentsService.processWebhook(rawBody, signature, eventData);
  }
}

