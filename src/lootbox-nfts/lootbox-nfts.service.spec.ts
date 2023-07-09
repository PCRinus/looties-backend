import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { LootboxNftsService } from '@@lootbox-nfts/lootbox-nfts.service';

describe('LootboxNftsService', () => {
  let service: LootboxNftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LootboxNftsService],
    }).compile();

    service = module.get<LootboxNftsService>(LootboxNftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
