# Phase 03 — Locations, Real Road Routing & Optimization

## Route provider
```ts
interface RouteProvider {
  getDistanceMatrix(points: Coordinate[]): Promise<DistanceMatrix>;
  getRoute(from: Coordinate, to: Coordinate): Promise<RouteResult>;
}
```

Providers may include OSRM, Google Routes, Mapbox or self-hosted routing.

Return distance, duration and geometry.

## Optimization
Modes:
- FASTEST
- SHORTEST
- RECOMMENDED

Process:
geocode/resolve → road matrix → initial route → 2-opt improvement → constraints → persist route version → persist TripStops/TripLegs.

Constraints:
- start/end
- round trip
- mandatory/optional stops
- stay duration
- dates
- max daily driving
- opening hours
- hotel check-in/out
- vehicle constraints

Exit: real road matrix, optimized route, geometry, versioning and provider failure handling work.
