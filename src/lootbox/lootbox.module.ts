import { Module } from '@nestjs/common';

import { LootboxController } from '@@lootbox/lootbox.controller';
import { LootboxService } from '@@lootbox/lootbox.service';
import { LootboxNftsModule } from '@@lootbox-nfts/lootbox-nfts.module';
import { LootboxTokensModule } from '@@lootbox-tokens/lootbox-tokens.module';
import { NftModule } from '@@nft/nft.module';
import { TokensModule } from '@@tokens/tokens.module';

@Module({
  imports: [NftModule, TokensModule, LootboxTokensModule, LootboxNftsModule],
  controllers: [LootboxController],
  providers: [LootboxService],
})
export class LootboxModule {}
