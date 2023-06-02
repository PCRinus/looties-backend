import { GameHistoryModule } from '@game-history/game-history.module';
import { ItemModule } from '@item/item.module';
import { Module } from '@nestjs/common';

import { ChatModule } from './chat/chat.module';
import { GameResponsiblyModule } from './game-responsibly/game-responsibly.module';
import { LiveDropsModule } from './live-drops/live-drops.module';
import { LootboxModule } from './lootbox/lootbox.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared/shared.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ItemModule,
    LootboxModule,
    ChatModule,
    ProfileModule,
    SharedModule,
    GameResponsiblyModule,
    LiveDropsModule,
    TransactionsModule,
    GameHistoryModule,
    UserModule,
  ],
})
export class AppModule {}
