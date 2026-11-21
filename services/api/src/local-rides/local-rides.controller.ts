import { Controller, Get, Query } from '@nestjs/common';
import { LocalRidesService } from './local-rides.service.js';

@Controller('local-rides')
export class LocalRidesController {
  constructor(private readonly localRidesService: LocalRidesService) {}

  /**
   * WAVE 1: ADR-001 Public Local Ride Directory Endpoint
   * Returns verified local ride drivers (Auto, Bike, Cab) with direct contact details.
   */
  @Get()
  async getDirectory(
    @Query('city') city?: string,
    @Query('vehicleType') vehicleType?: string,
  ) {
    return this.localRidesService.getDriversDirectory(city, vehicleType);
  }
}
