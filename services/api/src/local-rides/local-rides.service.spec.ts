import { Test, TestingModule } from '@nestjs/testing';
import { LocalRidesService } from './local-rides.service.js';

describe('LocalRidesService', () => {
  let service: LocalRidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalRidesService],
    }).compile();

    service = module.get<LocalRidesService>(LocalRidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
