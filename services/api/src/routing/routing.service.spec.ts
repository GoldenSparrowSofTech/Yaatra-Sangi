import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoutingService } from './routing.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { OsrmRouteProvider } from './providers/osrm-route.provider.js';
import { RouteOptimizerService } from './services/route-optimizer.service.js';

describe('RoutingService', () => {
  let service: RoutingService;
  let mockPrisma: any;
  let mockProvider: any;
  let optimizer: RouteOptimizerService;

  beforeEach(() => {
    mockPrisma = {
      destination: {
        findFirst: vi.fn(),
      },
    };

    mockProvider = {
      getDistanceMatrix: vi.fn().mockResolvedValue({
        distancesKm: [
          [0, 150],
          [150, 0],
        ],
        durationsMinutes: [
          [0, 180],
          [180, 0],
        ],
      }),
      getRoute: vi.fn().mockResolvedValue({
        distanceKm: 150,
        durationMinutes: 180,
        legs: [],
      }),
    };

    optimizer = new RouteOptimizerService();
    service = new RoutingService(mockPrisma, mockProvider as unknown as OsrmRouteProvider, optimizer);
  });

  it('should optimize an itinerary given direct coordinates', async () => {
    const result = await service.optimizeItinerary({
      destinations: [
        { name: 'City A', latitude: 20.0, longitude: 70.0 },
        { name: 'City B', latitude: 21.0, longitude: 71.0 },
      ],
      mode: 'FASTEST',
    });

    expect(result).toBeDefined();
    expect(result.orderedPoints.length).toBe(2);
    expect(result.totalDistanceKm).toBe(150);
  });

  it('should resolve destination coordinates from Prisma if missing in DTO', async () => {
    mockPrisma.destination.findFirst
      .mockResolvedValueOnce({ id: 'goa', name: 'Goa', latitude: 15.29, longitude: 74.12 })
      .mockResolvedValueOnce({ id: 'mumbai', name: 'Mumbai', latitude: 19.07, longitude: 72.87 });

    const result = await service.optimizeItinerary({
      destinations: [
        { id: 'goa' } as any,
        { id: 'mumbai' } as any,
      ],
    });

    expect(result).toBeDefined();
    expect(mockPrisma.destination.findFirst).toHaveBeenCalledTimes(2);
  });

  it('should throw BadRequestException if fewer than 2 valid points are provided', async () => {
    await expect(
      service.optimizeItinerary({
        destinations: [{ latitude: 10, longitude: 10 }],
      }),
    ).rejects.toThrow();
  });
});
