import { Test, TestingModule } from '@nestjs/testing';
import { LocalRidesGateway } from './local-rides.gateway.js';
import { LocalRidesService } from './local-rides.service.js';

describe('LocalRidesGateway', () => {
  let gateway: LocalRidesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalRidesGateway,
        {
          provide: LocalRidesService,
          useValue: {
            createRideBooking: vi.fn(),
            acceptRide: vi.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<LocalRidesGateway>(LocalRidesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
