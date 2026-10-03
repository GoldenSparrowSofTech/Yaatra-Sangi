import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service.js';
import { VendorController } from './vendor.controller.js';

@Module({
  providers: [VendorService],
  controllers: [VendorController]
})
export class VendorModule {}
