import { Injectable } from '@nestjs/common';
import {
  Coordinate,
  DistanceMatrix,
  IRouteProvider,
  RouteResult,
} from '../interfaces/route-provider.interface.js';

@Injectable()
export class HaversineRouteProvider implements IRouteProvider {
  // Road network tortuosity factor (actual road driving distance vs straight-line)
  private readonly ROAD_DETOUR_FACTOR = 1.25;
  // Average road speed (55 km/h across mixed Indian state/national highways)
  private readonly AVERAGE_SPEED_KMH = 55;

  private calculateHaversineKm(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getDistanceMatrix(points: Coordinate[]): Promise<DistanceMatrix> {
    const n = points.length;
    const distancesKm: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const durationsMinutes: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          distancesKm[i][j] = 0;
          durationsMinutes[i][j] = 0;
        } else {
          const directKm = this.calculateHaversineKm(
            points[i].latitude,
            points[i].longitude,
            points[j].latitude,
            points[j].longitude,
          );
          const roadKm = Math.round(directKm * this.ROAD_DETOUR_FACTOR * 10) / 10;
          const durationMins = Math.round((roadKm / this.AVERAGE_SPEED_KMH) * 60);

          distancesKm[i][j] = roadKm;
          durationsMinutes[i][j] = durationMins;
        }
      }
    }

    return { distancesKm, durationsMinutes };
  }

  async getRoute(from: Coordinate, to: Coordinate): Promise<RouteResult> {
    const directKm = this.calculateHaversineKm(
      from.latitude,
      from.longitude,
      to.latitude,
      to.longitude,
    );
    const distanceKm = Math.round(directKm * this.ROAD_DETOUR_FACTOR * 10) / 10;
    const durationMinutes = Math.round((distanceKm / this.AVERAGE_SPEED_KMH) * 60);

    return {
      distanceKm,
      durationMinutes,
      legs: [
        {
          from,
          to,
          distanceKm,
          durationMinutes,
        },
      ],
    };
  }
}

