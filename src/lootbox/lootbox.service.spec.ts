import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { LootboxService } from '@@lootbox/lootbox.service';
import { LootboxNftsService } from '@@lootbox-nfts/lootbox-nfts.service';
import { LootboxTokensService } from '@@lootbox-tokens/lootbox-tokens.service';
import { NftService } from '@@nft/nft.service';
import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { SharedModule } from '@@shared/shared.module';
import { TokensService } from '@@tokens/tokens.service';

describe('LootboxService', () => {
  let service: LootboxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, ConfigModule],
      providers: [
        LootboxService,
        NftService,
        LootboxNftsService,
        TokensService,
        LootboxTokensService,
        NftMetadataService,
        RpcConnectionService,
      ],
    }).compile();

    service = module.get<LootboxService>(LootboxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
