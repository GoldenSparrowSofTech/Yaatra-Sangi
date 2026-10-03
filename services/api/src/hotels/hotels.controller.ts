import { Controller, Get, Param, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service.js';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.hotelsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(id);
  }
}
