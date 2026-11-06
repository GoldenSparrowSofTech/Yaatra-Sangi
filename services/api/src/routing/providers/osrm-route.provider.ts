import { Injectable, Logger } from '@nestjs/common';
import {
  Coordinate,
  DistanceMatrix,
  IRouteProvider,
  RouteResult,
} from '../interfaces/route-provider.interface.js';
import { HaversineRouteProvider } from './haversine-route.provider.js';

@Injectable()
export class OsrmRouteProvider implements IRouteProvider {
  private readonly logger = new Logger(OsrmRouteProvider.name);
  private readonly baseUrl: string;

  constructor(private readonly fallbackProvider: HaversineRouteProvider) {
    this.baseUrl = process.env.OSRM_BASE_URL || 'https://router.project-osrm.org';
  }

  async getDistanceMatrix(points: Coordinate[]): Promise<DistanceMatrix> {
    if (points.length <= 1) {
      return { distancesKm: [[0]], durationsMinutes: [[0]] };
    }

    try {
      // OSRM coordinates format: {lon},{lat};{lon},{lat}
      const coords = points.map((p) => `${p.longitude},${p.latitude}`).join(';');
      const url = `${this.baseUrl}/table/v1/driving/${coords}?annotations=distance,duration`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`OSRM table request failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.code !== 'Ok' || !data.distances) {
        throw new Error(`OSRM error code: ${data.code}`);
      }

      // Convert meters to kilometers and seconds to minutes
      const distancesKm = data.distances.map((row: number[]) =>
        row.map((d) => Math.round((d / 1000) * 10) / 10),
      );
      const durationsMinutes = data.durations.map((row: number[]) =>
        row.map((s) => Math.round(s / 60)),
      );

      return { distancesKm, durationsMinutes };
    } catch (err: any) {
      this.logger.warn(`OSRM unavailable (${err?.message}). Falling back to algorithmic road model.`);
      return this.fallbackProvider.getDistanceMatrix(points);
    }
  }

  async getRoute(from: Coordinate, to: Coordinate): Promise<RouteResult> {
    try {
      const url = `${this.baseUrl}/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=polyline`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!res.ok) {
        throw new Error(`OSRM route request failed with status ${res.status}`);
      }

      const data = await res.json();
      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        throw new Error(`OSRM route returned no results`);
      }

      const primaryRoute = data.routes[0];
      const distanceKm = Math.round((primaryRoute.distance / 1000) * 10) / 10;
      const durationMinutes = Math.round(primaryRoute.duration / 60);

      return {
        distanceKm,
        durationMinutes,
        geometry: primaryRoute.geometry,
        legs: [
          {
            from,
            to,
            distanceKm,
            durationMinutes,
            geometry: primaryRoute.geometry,
          },
        ],
      };
    } catch (err: any) {
      this.logger.warn(`OSRM route failed (${err?.message}). Falling back to algorithmic route.`);
      return this.fallbackProvider.getRoute(from, to);
    }
  }
}

