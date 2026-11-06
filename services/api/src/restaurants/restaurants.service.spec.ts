import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('RestaurantsService', () => {
  let service: RestaurantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: PrismaService,
          useValue: {
            restaurant: {
              findMany: vi.fn().mockResolvedValue([]),
              findUnique: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
