import { Test, TestingModule } from '@nestjs/testing';
import { LiveDropsService } from './live-drops.service';
import { SharedModule } from '@shared/shared.module';

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
