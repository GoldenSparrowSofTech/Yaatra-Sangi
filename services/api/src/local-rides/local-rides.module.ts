import { Module } from '@nestjs/common';
import { LocalRidesService } from './local-rides.service.js';
import { LocalRidesController } from './local-rides.controller.js';
import { LocalRidesGateway } from './local-rides.gateway.js';

@Module({
  providers: [LocalRidesService, LocalRidesGateway],
  controllers: [LocalRidesController]
})
export class LocalRidesModule {}
