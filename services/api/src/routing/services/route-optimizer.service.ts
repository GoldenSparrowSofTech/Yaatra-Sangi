import { Injectable } from '@nestjs/common';
import { Coordinate, DistanceMatrix } from '../interfaces/route-provider.interface.js';

export type OptimizationMode = 'FASTEST' | 'SHORTEST' | 'RECOMMENDED';

export interface OptimizationOptions {
  mode?: OptimizationMode;
  isRoundTrip?: boolean;
  fixedEndIndex?: number;
}

export interface OptimizedRoute {
  orderedPoints: Coordinate[];
  orderedIndices: number[];
  totalDistanceKm: number;
  totalDurationMinutes: number;
  savingsPercentage: number;
  legs: {
    from: Coordinate;
    to: Coordinate;
    distanceKm: number;
    durationMinutes: number;
  }[];
}

@Injectable()
export class RouteOptimizerService {
  /**
   * Optimizes the visiting sequence of coordinates using Nearest-Neighbor + 2-Opt TSP heuristic.
   */
  optimize(
    points: Coordinate[],
    matrix: DistanceMatrix,
    options: OptimizationOptions = {},
  ): OptimizedRoute {
    const n = points.length;
    if (n <= 2) {
      return this.buildResult(points, [0, ...(n === 2 ? [1] : [])], matrix, options.isRoundTrip || false, 0);
    }

    const { mode = 'RECOMMENDED', isRoundTrip = false, fixedEndIndex } = options;
    const costMatrix = mode === 'FASTEST' ? matrix.durationsMinutes : matrix.distancesKm;

    // 1. Calculate original sequence cost
    const originalCost = this.calculatePathCost(
      Array.from({ length: n }, (_, i) => i),
      costMatrix,
      isRoundTrip,
    );

    // 2. Initial Tour via Nearest-Neighbor heuristic starting from index 0
    let tour = this.nearestNeighbor(n, costMatrix, fixedEndIndex);

    // 3. 2-Opt Local Search Improvement
    tour = this.twoOpt(tour, costMatrix, isRoundTrip, fixedEndIndex !== undefined);

    // 4. Calculate optimized sequence cost
    const optimizedCost = this.calculatePathCost(tour, costMatrix, isRoundTrip);
    const savings =
      originalCost > 0
        ? Math.max(0, Math.round(((originalCost - optimizedCost) / originalCost) * 100))
        : 0;

    return this.buildResult(points, tour, matrix, isRoundTrip, savings);
  }

  private nearestNeighbor(
    n: number,
    costMatrix: number[][],
    fixedEndIndex?: number,
  ): number[] {
    const visited = new Set<number>();
    const tour: number[] = [0];
    visited.add(0);

    if (fixedEndIndex !== undefined && fixedEndIndex > 0) {
      visited.add(fixedEndIndex);
    }

    while (tour.length < (fixedEndIndex !== undefined ? n - 1 : n)) {
      const current = tour[tour.length - 1];
      let nearest = -1;
      let minCost = Infinity;

      for (let next = 0; next < n; next++) {
        if (!visited.has(next)) {
          const cost = costMatrix[current][next];
          if (cost < minCost) {
            minCost = cost;
            nearest = next;
          }
        }
      }

      if (nearest !== -1) {
        tour.push(nearest);
        visited.add(nearest);
      } else {
        break;
      }
    }

    if (fixedEndIndex !== undefined && fixedEndIndex > 0) {
      tour.push(fixedEndIndex);
    }

    return tour;
  }

  /**
   * 2-Opt swap heuristic: Inverts sub-tours to untangle crossing paths until no 2-edge swap yields improvement.
   */
  private twoOpt(
    tour: number[],
    costMatrix: number[][],
    isRoundTrip: boolean,
    hasFixedEnd: boolean,
  ): number[] {
    let improved = true;
    let bestTour = [...tour];
    let bestCost = this.calculatePathCost(bestTour, costMatrix, isRoundTrip);

    const maxIterations = 50;
    let iteration = 0;

    // Start index is fixed at 0. If end is fixed, don't swap the last element.
    const endIndex = hasFixedEnd ? bestTour.length - 1 : bestTour.length;

    while (improved && iteration < maxIterations) {
      improved = false;
      iteration++;

      for (let i = 1; i < endIndex - 1; i++) {
        for (let k = i + 1; k < endIndex; k++) {
          const candidateTour = this.twoOptSwap(bestTour, i, k);
          const candidateCost = this.calculatePathCost(candidateTour, costMatrix, isRoundTrip);

          if (candidateCost < bestCost - 0.001) {
            bestTour = candidateTour;
            bestCost = candidateCost;
            improved = true;
            break;
          }
        }
        if (improved) break;
      }
    }

    return bestTour;
  }

  private twoOptSwap(tour: number[], i: number, k: number): number[] {
    const newTour = tour.slice(0, i);
    const reversedSegment = tour.slice(i, k + 1).reverse();
    const remaining = tour.slice(k + 1);
    return newTour.concat(reversedSegment).concat(remaining);
  }

  private calculatePathCost(
    path: number[],
    costMatrix: number[][],
    isRoundTrip: boolean,
  ): number {
    let total = 0;
    for (let i = 0; i < path.length - 1; i++) {
      total += costMatrix[path[i]][path[i + 1]];
    }
    if (isRoundTrip && path.length > 1) {
      total += costMatrix[path[path.length - 1]][path[0]];
    }
    return total;
  }

  private buildResult(
    points: Coordinate[],
    tour: number[],
    matrix: DistanceMatrix,
    isRoundTrip: boolean,
    savingsPercentage: number,
  ): OptimizedRoute {
    const orderedIndices = isRoundTrip ? [...tour, tour[0]] : [...tour];
    const orderedPoints = orderedIndices.map((idx) => points[idx]);

    const legs: OptimizedRoute['legs'] = [];
    let totalDistanceKm = 0;
    let totalDurationMinutes = 0;

    for (let i = 0; i < orderedIndices.length - 1; i++) {
      const fromIdx = orderedIndices[i];
      const toIdx = orderedIndices[i + 1];
      const distanceKm = matrix.distancesKm[fromIdx][toIdx];
      const durationMinutes = matrix.durationsMinutes[fromIdx][toIdx];

      totalDistanceKm += distanceKm;
      totalDurationMinutes += durationMinutes;

      legs.push({
        from: points[fromIdx],
        to: points[toIdx],
        distanceKm,
        durationMinutes,
      });
    }

    return {
      orderedPoints,
      orderedIndices,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      totalDurationMinutes,
      savingsPercentage,
      legs,
    };
  }
}

