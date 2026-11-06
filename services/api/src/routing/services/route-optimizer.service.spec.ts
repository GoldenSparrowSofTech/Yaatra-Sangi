import { describe, it, expect } from 'vitest';
import { RouteOptimizerService } from './route-optimizer.service.js';
import { Coordinate, DistanceMatrix } from '../interfaces/route-provider.interface.js';

describe('RouteOptimizerService', () => {
  const optimizer = new RouteOptimizerService();

  // Test Gujarat Circuit: Rajkot -> Dwarka -> Somnath -> Junagadh
  const points: Coordinate[] = [
    { id: 'rajkot', name: 'Rajkot', latitude: 22.3039, longitude: 70.8022 },
    { id: 'somnath', name: 'Somnath', latitude: 20.8880, longitude: 70.4012 },
    { id: 'dwarka', name: 'Dwarka', latitude: 22.2442, longitude: 68.9685 },
    { id: 'junagadh', name: 'Junagadh', latitude: 21.5222, longitude: 70.4579 },
  ];

  // Distances matrix representing road kms between destinations
  const matrix: DistanceMatrix = {
    distancesKm: [
      [0, 195, 225, 105],  // Rajkot to [Rajkot, Somnath, Dwarka, Junagadh]
      [195, 0, 230, 85],   // Somnath to [Rajkot, Somnath, Dwarka, Junagadh]
      [225, 230, 0, 210],  // Dwarka to [Rajkot, Somnath, Dwarka, Junagadh]
      [105, 85, 210, 0],   // Junagadh to [Rajkot, Somnath, Dwarka, Junagadh]
    ],
    durationsMinutes: [
      [0, 240, 270, 130],
      [240, 0, 290, 110],
      [270, 290, 0, 260],
      [130, 110, 260, 0],
    ],
  };

  it('should optimize an arbitrary input sequence to the most efficient tour', () => {
    const result = optimizer.optimize(points, matrix, {
      mode: 'SHORTEST',
      isRoundTrip: true,
    });

    expect(result.orderedPoints.length).toBe(5); // 4 points + return to origin
    expect(result.orderedPoints[0].name).toBe('Rajkot');
    expect(result.orderedPoints[4].name).toBe('Rajkot');
    expect(result.totalDistanceKm).toBeGreaterThan(0);
    expect(result.legs.length).toBe(4);
  });

  it('should support one-way itinerary starting at point 0', () => {
    const result = optimizer.optimize(points, matrix, {
      mode: 'RECOMMENDED',
      isRoundTrip: false,
    });

    expect(result.orderedPoints.length).toBe(4);
    expect(result.orderedPoints[0].name).toBe('Rajkot');
    expect(result.legs.length).toBe(3);
  });

  it('should handle small itineraries with 2 destinations trivially', () => {
    const twoPoints = [points[0], points[1]];
    const twoMatrix: DistanceMatrix = {
      distancesKm: [
        [0, 195],
        [195, 0],
      ],
      durationsMinutes: [
        [0, 240],
        [240, 0],
      ],
    };

    const result = optimizer.optimize(twoPoints, twoMatrix, { isRoundTrip: false });
    expect(result.orderedPoints.length).toBe(2);
    expect(result.totalDistanceKm).toBe(195);
  });
});

