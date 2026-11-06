export interface Coordinate {
  id?: string;
  name?: string;
  latitude: number;
  longitude: number;
}

export interface RouteLeg {
  from: Coordinate;
  to: Coordinate;
  distanceKm: number;
  durationMinutes: number;
  geometry?: string; // Encoded polyline or geojson
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  legs: RouteLeg[];
  geometry?: string;
}

export interface DistanceMatrix {
  distancesKm: number[][];
  durationsMinutes: number[][];
}

export interface IRouteProvider {
  getDistanceMatrix(points: Coordinate[]): Promise<DistanceMatrix>;
  getRoute(from: Coordinate, to: Coordinate): Promise<RouteResult>;
}

