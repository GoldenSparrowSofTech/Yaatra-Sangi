import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DestinationsService } from './destinations.service.js';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  create(@Body() createDestinationDto: { name: string; state: string; country: string; latitude: number; longitude: number }) {
    return this.destinationsService.create(createDestinationDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    if (search) {
      return this.destinationsService.search(search);
    }
    return this.destinationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.destinationsService.findOne(id);
  }
}
