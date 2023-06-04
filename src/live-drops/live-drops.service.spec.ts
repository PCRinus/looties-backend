import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { SharedModule } from '@shared/shared.module';

import { LiveDropsService } from './live-drops.service';

describe('LiveDropsService', () => {
  let service: LiveDropsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [LiveDropsService],
    }).compile();

    service = module.get<LiveDropsService>(LiveDropsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
