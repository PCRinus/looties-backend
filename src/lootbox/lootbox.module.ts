import { Module } from '@nestjs/common';

import { LootboxController } from '@@lootbox/lootbox.controller';
import { LootboxService } from '@@lootbox/lootbox.service';

@Module({
  controllers: [LootboxController],
  providers: [LootboxService],
})
export class LootboxModule {}
