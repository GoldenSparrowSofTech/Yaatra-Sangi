import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class BookingExpiryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(BookingExpiryService.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    // Run cleanup every 60 seconds
    this.timer = setInterval(() => {
      this.cleanupExpiredHolds().catch((err) => {
        this.logger.error(`Error in automated hold cleanup: ${err?.message}`);
      });
    }, 60 * 1000);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  /**
   * Scans for bookings in 'HELD' status whose hold window has elapsed and releases them.
   */
  async cleanupExpiredHolds(): Promise<number> {
    const now = new Date();

    const result = await this.prisma.booking.updateMany({
      where: {
        status: 'HELD',
        holdExpiresAt: {
          lt: now,
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });

    if (result.count > 0) {
      this.logger.log(`Released and marked ${result.count} expired booking hold(s)`);
    }

    return result.count;
  }
}

