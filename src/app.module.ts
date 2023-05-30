import { Module } from '@nestjs/common';
import { ItemModule } from '@item/item.module';
import { LootboxModule } from './lootbox/lootbox.module';
import { ChatModule } from './chat/chat.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [ItemModule, LootboxModule, ChatModule, ProfileModule, SharedModule],
})
export class AppModule {}
