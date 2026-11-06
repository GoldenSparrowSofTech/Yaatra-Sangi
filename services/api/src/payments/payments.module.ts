import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { PaymentsController } from './payments.controller.js';
import { RazorpayPaymentProvider } from './providers/razorpay-payment.provider.js';
import { MockPaymentProvider } from './providers/mock-payment.provider.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService, RazorpayPaymentProvider, MockPaymentProvider],
  exports: [PaymentsService, RazorpayPaymentProvider],
})
export class PaymentsModule {}

