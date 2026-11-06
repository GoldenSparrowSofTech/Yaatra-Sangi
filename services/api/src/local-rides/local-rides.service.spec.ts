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
});
