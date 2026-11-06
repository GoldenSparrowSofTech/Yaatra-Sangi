import { Controller, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { HotelsService } from './hotels.service.js';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('search/nearby')
  async searchNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    if (!lat || !lng) {
      throw new BadRequestException('Query parameters "lat" and "lng" are required');
    }
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const parsedRadius = radius ? parseFloat(radius) : 10;

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      throw new BadRequestException('"lat" and "lng" must be valid numeric coordinates');
    }

    return this.hotelsService.searchNearby(parsedLat, parsedLng, parsedRadius);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.hotelsService.findAll(search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }
}
