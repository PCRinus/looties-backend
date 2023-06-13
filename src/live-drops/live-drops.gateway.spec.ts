import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ItemModule } from '@@item/item.module';
import { ItemService } from '@@item/item.service';
import { LiveDropsService } from '@@live-drops/live-drops.service';
import { SharedModule } from '@@shared/shared.module';

import { LiveDropsGateway } from './live-drops.gateway';

describe('LiveDropsGateway', () => {
  let gateway: LiveDropsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ItemModule, SharedModule],
      providers: [LiveDropsGateway, ItemService, LiveDropsService],
    }).compile();

    gateway = module.get<LiveDropsGateway>(LiveDropsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
