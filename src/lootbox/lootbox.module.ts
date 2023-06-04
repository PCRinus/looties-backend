import { Module } from '@nestjs/common';

import { LootboxController } from './lootbox.controller';
import { LootboxService } from './lootbox.service';

@Module({
  controllers: [LootboxController],
  providers: [LootboxService],
})
export class LootboxModule {}
