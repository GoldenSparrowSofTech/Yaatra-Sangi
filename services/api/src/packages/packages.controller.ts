import { Controller, Get, Query } from '@nestjs/common';
import { PackagesService } from './packages.service.js';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  findAll(@Query('location') location?: string) {
    return this.packagesService.findAll(location);
  }
}
