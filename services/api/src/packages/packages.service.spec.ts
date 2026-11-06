import { Test, TestingModule } from '@nestjs/testing';
import { PackagesService } from './packages.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('PackagesService', () => {
  let service: PackagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PackagesService,
        {
          provide: PrismaService,
          useValue: {
            package: {
              findMany: vi.fn().mockResolvedValue([]),
              findUnique: vi.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PackagesService>(PackagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
