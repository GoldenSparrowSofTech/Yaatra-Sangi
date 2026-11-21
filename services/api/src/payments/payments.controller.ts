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
import { Throttle } from '../common/guards/rate-limit.guard.js';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * WAVE 1: Customer booking payment order creation disabled per direct-connection marketplace policy.
   */
  @Throttle(10, 60)
  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(
    @Body() body: { bookingId?: string; amount?: number; currency?: string },
    @CurrentUser('id') userId: string,
  ) {
    throw new BadRequestException(
      'Customer booking payments are disabled. YaatraSangi is a direct-connection marketplace without customer booking checkout.',
    );
  }

  /**
   * WAVE 1: Customer booking payment verification disabled per direct-connection marketplace policy.
   */
  @Throttle(10, 60)
  @UseGuards(JwtAuthGuard)
  @Post('verify')
  async verifyPayment(
    @Body() body: { orderId?: string; paymentId?: string; signature?: string },
  ) {
    throw new BadRequestException(
      'Customer booking payment verification is disabled. Transactions are handled directly with providers.',
    );
  }

  @Throttle(60, 60)
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

