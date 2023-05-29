import { Module } from '@nestjs/common';
import { ItemModule } from '@item/item.module';
import { LootboxModule } from './lootbox/lootbox.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ItemModule, LootboxModule, ChatModule],
})
export class AppModule {}
