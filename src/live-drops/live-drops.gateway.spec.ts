import { Test, TestingModule } from '@nestjs/testing';
import { LiveDropsGateway } from './live-drops.gateway';

describe('LiveDropsGateway', () => {
  let gateway: LiveDropsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveDropsGateway],
    }).compile();

    gateway = module.get<LiveDropsGateway>(LiveDropsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
