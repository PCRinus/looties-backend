import { GameHistoryModule } from '@game-history/game-history.module';
import { ItemModule } from '@item/item.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { ChatModule } from './chat/chat.module';
import { GameResponsiblyModule } from './game-responsibly/game-responsibly.module';
import { LiveDropsModule } from './live-drops/live-drops.module';
import { LootboxModule } from './lootbox/lootbox.module';
import { ProfileModule } from './profile/profile.module';
import { SharedModule } from './shared/shared.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

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
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'production', 'test').default('development'),
        POSTGRES_DB: Joi.string(),
        POSTGRES_USER: Joi.string(),
        POSTGRES_PASSWORD: Joi.string(),
        PGADMIN_DEFAULT_EMAIL: Joi.string(),
        PGADMIN_DEFAULT_PASSWORD: Joi.string(),
        DATABASE_URL: Joi.string(),
      }),
      expandVariables: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
