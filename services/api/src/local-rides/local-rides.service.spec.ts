import { Test, TestingModule } from '@nestjs/testing';
import { LocalRidesService } from './local-rides.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('LocalRidesService', () => {
  let service: LocalRidesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalRidesService,
        {
          provide: PrismaService,
          useValue: {
            ride: {
              create: vi.fn(),
              findUnique: vi.fn(),
              update: vi.fn(),
            },
            $transaction: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<LocalRidesService>(LocalRidesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return local drivers directory for direct contact per ADR-001', async () => {
    const drivers = await service.getDriversDirectory();
    expect(drivers).toBeDefined();
    expect(drivers.length).toBeGreaterThan(0);
    expect(drivers[0].contactPhone).toBeDefined();
    expect(drivers[0].vehicleType).toBeDefined();
  });

  it('should reject createRideBooking with BadRequestException per ADR-001', async () => {
    await expect(
      service.createRideBooking({
        userId: 'u-1',
        pickup: 'A',
        drop: 'B',
        vehicleType: 'auto',
      }),
    ).rejects.toThrow();
  });

  it('should reject acceptRide with BadRequestException per ADR-001', async () => {
    await expect(service.acceptRide('b-1', 'd-1')).rejects.toThrow();
  });
});
