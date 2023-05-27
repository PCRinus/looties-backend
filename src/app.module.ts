import { Module } from '@nestjs/common';
import { ItemModule } from '@item/item.module';
import { LootboxModule } from './lootbox/lootbox.module';

@Module({
  imports: [ItemModule, LootboxModule],
})
export class AppModule {}
