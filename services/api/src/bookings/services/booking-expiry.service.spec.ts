import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BookingExpiryService } from './booking-expiry.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('BookingExpiryService', () => {
  let service: BookingExpiryService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      booking: {
        updateMany: vi.fn(),
      },
    };
    service = new BookingExpiryService(mockPrisma as unknown as PrismaService);
  });

  it('should scan and transition expired HELD bookings to EXPIRED', async () => {
    mockPrisma.booking.updateMany.mockResolvedValue({ count: 3 });

    const count = await service.cleanupExpiredHolds();

    expect(count).toBe(3);
    expect(mockPrisma.booking.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: 'HELD',
        }),
        data: {
          status: 'EXPIRED',
        },
      }),
    );
  });
});

