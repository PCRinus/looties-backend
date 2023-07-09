import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { LootboxTokensService } from '@@lootbox-tokens/lootbox-tokens.service';

describe('LootboxTokensService', () => {
  let service: LootboxTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LootboxTokensService],
    }).compile();

    service = module.get<LootboxTokensService>(LootboxTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
