import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { RoutingService } from './routing.service.js';
import { OptimizeRouteDto, DistanceMatrixDto } from './dto/optimize-route.dto.js';

@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Post('optimize')
  async optimize(@Body() dto: OptimizeRouteDto) {
    return this.routingService.optimizeItinerary(dto);
  }

  @Post('matrix')
  async matrix(@Body() dto: DistanceMatrixDto) {
    if (!dto.points || dto.points.length < 2) {
      throw new BadRequestException('At least 2 points are required for distance matrix');
    }
    return this.routingService.getDistanceMatrix(dto.points);
  }

  @Get('directions')
  async getDirections(
    @Query('fromLat') fromLat: string,
    @Query('fromLng') fromLng: string,
    @Query('toLat') toLat: string,
    @Query('toLng') toLng: string,
  ) {
    if (!fromLat || !fromLng || !toLat || !toLng) {
      throw new BadRequestException('fromLat, fromLng, toLat, and toLng query parameters are required');
    }

    return this.routingService.getRoute(
      { latitude: parseFloat(fromLat), longitude: parseFloat(fromLng) },
      { latitude: parseFloat(toLat), longitude: parseFloat(toLng) },
    );
  }
}

