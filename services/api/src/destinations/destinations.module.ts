import { Module } from '@nestjs/common';
import { DestinationsController } from './destinations.controller.js';
import { DestinationsService } from './destinations.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DestinationsController],
  providers: [DestinationsService],
})
export class DestinationsModule {}
