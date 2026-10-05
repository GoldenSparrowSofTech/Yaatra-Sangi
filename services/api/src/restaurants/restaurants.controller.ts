import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service.js';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@Query('location') location?: string) {
    return this.restaurantsService.findAll(location);
  }
}
