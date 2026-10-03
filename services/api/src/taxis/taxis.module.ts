import { Module } from '@nestjs/common';
import { TaxisService } from './taxis.service.js';
import { TaxisController } from './taxis.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [TaxisController],
  providers: [TaxisService],
})
export class TaxisModule {}
