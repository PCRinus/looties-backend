import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { LootboxController } from '@@lootbox/lootbox.controller';
import { LootboxService } from '@@lootbox/lootbox.service';
import { LootboxNftsService } from '@@lootbox-nfts/lootbox-nfts.service';
import { LootboxTokensService } from '@@lootbox-tokens/lootbox-tokens.service';
import { NftService } from '@@nft/nft.service';
import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { SharedModule } from '@@shared/shared.module';
import { TokensService } from '@@tokens/tokens.service';

describe('LootboxController', () => {
  let controller: LootboxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, JwtModule, ConfigModule],
      controllers: [LootboxController],
      providers: [
        LootboxService,
        NftService,
        TokensService,
        LootboxNftsService,
        LootboxTokensService,
        NftMetadataService,
        RpcConnectionService,
      ],
    }).compile();

    controller = module.get<LootboxController>(LootboxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
