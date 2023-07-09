import { Module } from '@nestjs/common';

import { LootboxNftsService } from '@@lootbox-nfts/lootbox-nfts.service';

@Module({
  providers: [LootboxNftsService],
  exports: [LootboxNftsService],
})
export class LootboxNftsModule {}
