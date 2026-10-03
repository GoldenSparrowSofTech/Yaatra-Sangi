import { Test, TestingModule } from '@nestjs/testing';
import { LocalRidesGateway } from './local-rides.gateway.js';

describe('LocalRidesGateway', () => {
  let gateway: LocalRidesGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalRidesGateway],
    }).compile();

    gateway = module.get<LocalRidesGateway>(LocalRidesGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
