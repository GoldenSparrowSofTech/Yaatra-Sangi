import { Test, TestingModule } from '@nestjs/testing';
import { LocalRidesController } from './local-rides.controller.js';
import { LocalRidesService } from './local-rides.service.js';

describe('LocalRidesController', () => {
  let controller: LocalRidesController;
  let mockService: any;

  beforeEach(async () => {
    mockService = {
      getDriversDirectory: vi.fn().mockResolvedValue([
        { id: '1', driverName: 'Ramesh Bhai', vehicleType: 'Auto', contactPhone: '+919876543210' },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalRidesController],
      providers: [
        {
          provide: LocalRidesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LocalRidesController>(LocalRidesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return directory of local drivers for direct contact', async () => {
    const result = await controller.getDirectory();
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
    expect(result[0].contactPhone).toBe('+919876543210');
  });
});
