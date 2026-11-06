import { Module } from '@nestjs/common';
import { RoutingService } from './routing.service.js';
import { RoutingController } from './routing.controller.js';
import { RouteOptimizerService } from './services/route-optimizer.service.js';
import { HaversineRouteProvider } from './providers/haversine-route.provider.js';
import { OsrmRouteProvider } from './providers/osrm-route.provider.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [RoutingController],
  providers: [
    RoutingService,
    RouteOptimizerService,
    HaversineRouteProvider,
    OsrmRouteProvider,
  ],
  exports: [RoutingService, RouteOptimizerService, OsrmRouteProvider],
})
export class RoutingModule {}

