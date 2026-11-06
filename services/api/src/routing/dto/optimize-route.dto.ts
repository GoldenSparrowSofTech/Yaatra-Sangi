import { OptimizationMode } from '../services/route-optimizer.service.js';

export class CoordinateDto {
  id?: string;
  name?: string;
  latitude: number;
  longitude: number;
}

export class OptimizeRouteDto {
  destinations: CoordinateDto[];
  mode?: OptimizationMode; // FASTEST, SHORTEST, RECOMMENDED
  isRoundTrip?: boolean;
  fixedEndIndex?: number;
}

export class DistanceMatrixDto {
  points: CoordinateDto[];
}

