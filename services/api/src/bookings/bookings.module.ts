import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { BookingsController } from './bookings.controller.js';
import { BookingExpiryService } from './services/booking-expiry.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { PaymentsModule } from '../payments/payments.module.js';
import { IdempotencyService } from '../common/idempotency/idempotency.service.js';
import { IdempotencyInterceptor } from '../common/idempotency/idempotency.interceptor.js';

@Module({
  imports: [PrismaModule, PaymentsModule],
  controllers: [BookingsController],
  providers: [
    BookingsService,
    BookingExpiryService,
    IdempotencyService,
    IdempotencyInterceptor,
  ],
  exports: [BookingsService, BookingExpiryService, IdempotencyService],
})
export class BookingsModule {}

