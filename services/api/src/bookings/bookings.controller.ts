import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Headers,
  UseGuards,
  UseInterceptors,
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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(IdempotencyInterceptor)
  @Post('hold')
  async createHold(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBookingHoldDto,
    @Headers('idempotency-key') idempotencyKey?: string,
  ) {
    return this.bookingsService.createHold(userId, dto, idempotencyKey);
  }

  @UseGuards(JwtAuthGuard)
  @Post('confirm')
  async confirmBooking(
    @CurrentUser('id') userId: string,
    @Body() dto: ConfirmBookingDto,
  ) {
    return this.bookingsService.confirmBooking(userId, dto);
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

