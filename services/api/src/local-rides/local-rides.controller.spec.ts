import { Test, TestingModule } from '@nestjs/testing';
import { LocalRidesController } from './local-rides.controller.js';

describe('LocalRidesController', () => {
  let controller: LocalRidesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocalRidesController],
    }).compile();

    controller = module.get<LocalRidesController>(LocalRidesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
