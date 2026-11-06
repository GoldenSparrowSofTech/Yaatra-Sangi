import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OsrmRouteProvider } from './providers/osrm-route.provider.js';
import {
  RouteOptimizerService,
  OptimizedRoute,
} from './services/route-optimizer.service.js';
import { Coordinate } from './interfaces/route-provider.interface.js';
import { OptimizeRouteDto } from './dto/optimize-route.dto.js';

@Injectable()
export class RoutingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly routeProvider: OsrmRouteProvider,
    private readonly routeOptimizer: RouteOptimizerService,
  ) {}

  /**
   * Optimizes a multi-city travel itinerary based on actual road distance/time matrix.
   */
  async optimizeItinerary(dto: OptimizeRouteDto): Promise<OptimizedRoute> {
    if (!dto.destinations || dto.destinations.length === 0) {
      throw new BadRequestException('At least 2 destinations are required for route optimization');
    }

    // Resolve coordinates from database if coordinates are missing but ID or name is provided
    const resolvedPoints: Coordinate[] = [];

    for (const d of dto.destinations) {
      const hasCoords =
        typeof d.latitude === 'number' &&
        typeof d.longitude === 'number' &&
        (d.latitude !== 0 || d.longitude !== 0);

      if (hasCoords) {
        resolvedPoints.push({
          id: d.id,
          name: d.name || 'Custom Location',
          latitude: d.latitude,
          longitude: d.longitude,
        });
      } else if (d.id || d.name) {
        const dest = await this.prisma.destination.findFirst({
          where: {
            OR: [
              ...(d.id ? [{ id: d.id.toLowerCase() }] : []),
              ...(d.name ? [{ name: { contains: d.name } }] : []),
            ],
          },
        });

        if (dest && dest.latitude && dest.longitude) {
          resolvedPoints.push({
            id: dest.id,
            name: dest.name,
            latitude: dest.latitude,
            longitude: dest.longitude,
          });
        }
      }
    }

    if (resolvedPoints.length < 2) {
      throw new BadRequestException('Could not resolve at least 2 valid coordinates for optimization');
    }

    // 1. Fetch road distance matrix
    const matrix = await this.routeProvider.getDistanceMatrix(resolvedPoints);

    // 2. Run TSP optimization algorithm
    const optimized = this.routeOptimizer.optimize(resolvedPoints, matrix, {
      mode: dto.mode || 'RECOMMENDED',
      isRoundTrip: dto.isRoundTrip ?? false,
      fixedEndIndex: dto.fixedEndIndex,
    });

    return optimized;
  }

  /**
   * Get direct point-to-point driving route and geometry between two coordinates
   */
  async getRoute(from: Coordinate, to: Coordinate) {
    return this.routeProvider.getRoute(from, to);
  }

  /**
   * Get road distance and duration matrix for arbitrary coordinates
   */
  async getDistanceMatrix(points: Coordinate[]) {
    return this.routeProvider.getDistanceMatrix(points);
  }
}
