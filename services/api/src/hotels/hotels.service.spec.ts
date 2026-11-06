import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HotelsService } from './hotels.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('HotelsService', () => {
  let service: HotelsService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      hotel: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
      },
    };
    service = new HotelsService(mockPrisma as unknown as PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should filter hotels within 10km radius and calculate distance', async () => {
    // Goa center: 15.2993, 74.1240
    mockPrisma.hotel.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'Close Resort',
        price: 15000,
        latitude: 15.3100, // ~1.5 km away
        longitude: 74.1280,
        isVerified: true,
        isActive: true,
      },
      {
        id: 2,
        name: 'Distant Hotel',
        price: 5000,
        latitude: 15.6500, // ~40 km away
        longitude: 73.8000,
        isVerified: true,
        isActive: true,
      },
    ]);

    const results = await service.searchNearby(15.2993, 74.1240, 10);

    // Only 'Close Resort' is within 10 km
    expect(results.length).toBe(1);
    expect(results[0].name).toBe('Close Resort');
    expect(results[0].distanceKm).toBeLessThanOrEqual(10);
  });
});

