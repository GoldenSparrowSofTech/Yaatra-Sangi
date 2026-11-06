import { Test, TestingModule } from '@nestjs/testing';
import { PackagesController } from './packages.controller.js';
import { PackagesService } from './packages.service.js';

describe('PackagesController', () => {
  let controller: PackagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackagesController],
      providers: [
        {
          provide: PackagesService,
          useValue: {
            findAll: vi.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    controller = module.get<PackagesController>(PackagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
