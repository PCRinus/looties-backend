import { Module } from '@nestjs/common';

import { LootboxTokensService } from '@@lootbox-tokens/lootbox-tokens.service';

@Module({
  providers: [LootboxTokensService],
  exports: [LootboxTokensService],
})
export class LootboxTokensModule {}
