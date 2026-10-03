import { Controller, Get, Query } from '@nestjs/common';
import { TaxisService } from './taxis.service.js';

@Controller('taxis')
export class TaxisController {
  constructor(private readonly taxisService: TaxisService) {}

  @Get()
  findAll(@Query('pickup') pickup?: string, @Query('dropoff') dropoff?: string) {
    return this.taxisService.findAll(pickup, dropoff);
  }
}
