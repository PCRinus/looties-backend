import { Test, TestingModule } from '@nestjs/testing';
import { LiveDropsService } from './live-drops.service';

describe('LiveDropsService', () => {
  let service: LiveDropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveDropsService],
    }).compile();

    service = module.get<LiveDropsService>(LiveDropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
