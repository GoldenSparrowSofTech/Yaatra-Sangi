import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service.js';
import { BookingExpiryService } from './services/booking-expiry.service.js';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto.js';
import { ConfirmBookingDto } from './dto/confirm-booking.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../auth/enums/role.enum.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { IdempotencyInterceptor } from '../common/idempotency/idempotency.interceptor.js';
import { RequireOwnership } from '../common/guards/tenant-ownership.guard.js';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly expiryService: BookingExpiryService,
  ) {}

  /**
   * WAVE 1: Customer booking-hold endpoint disabled per direct-connection marketplace policy.
   */
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(IdempotencyInterceptor)
  @Post('hold')
  async createHold(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBookingHoldDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    throw new BadRequestException(
      'Direct-connect marketplace: Customer booking holds are disabled per business policy. Connect directly with the business provider via Call or WhatsApp.',
    );
  }

  /**
   * WAVE 1: Customer booking-confirm endpoint disabled per direct-connection marketplace policy.
   */
  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirmBooking(
    @CurrentUser('id') userId: string,
    @Body() dto: ConfirmBookingDto,
  ) {
    throw new BadRequestException(
      'Direct-connect marketplace: Customer booking checkout is disabled. Bookings, confirmations, and payments are handled directly with providers.',
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserBookings(@CurrentUser('id') userId: string) {
    return this.bookingsService.getUserBookings(userId);
  }

  @UseGuards(JwtAuthGuard)
  @RequireOwnership({ paramName: 'id' })
  @Get(':id')
  async getBooking(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.bookingsService.getBooking(userId, id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post('cleanup-expired')
  async triggerExpiryCleanup() {
    const expiredCount = await this.expiryService.cleanupExpiredHolds();
    return {
      success: true,
      expiredCount,
      timestamp: new Date(),
    };
  }
}

