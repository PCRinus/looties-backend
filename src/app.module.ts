import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { GameHistoryModule } from '@@game-history/game-history.module';

import { AffiliatesModule } from './affiliates/affiliates.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CurrencyModule } from './currency/currency.module';
import { DepositModule } from './deposit/deposit.module';
import { GameResponsiblyModule } from './game-responsibly/game-responsibly.module';
import { HealthModule } from './health/health.module';
import { LiveDropsModule } from './live-drops/live-drops.module';
import { LootboxModule } from './lootbox/lootbox.module';
import { LootboxTokensModule } from './lootbox-tokens/lootbox-tokens.module';
import { NftModule } from './nft/nft.module';
import { NftMetadataModule } from './nft-metadata/nft-metadata.module';
import { ProfileModule } from './profile/profile.module';
import { RpcConnectionModule } from './rpc-connection/rpc-connection.module';
import { SharedModule } from './shared/shared.module';
import { TokensModule } from './tokens/tokens.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UserModule } from './user/user.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { WithdrawalModule } from './withdrawal/withdrawal.module';

@Module({
  imports: [
    HealthModule,
    AuthModule,
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
        JWT_SECRET: Joi.string(),
        DISABLE_ERD: Joi.boolean().default(false),
        SOLANA_RPC_ENDPOINT: Joi.string(),
        HOUSE_WALLET_SECRET: Joi.string(),
      }),
      expandVariables: true,
    }),
    AffiliatesModule,
    UserSettingsModule,
    WithdrawalModule,
    CurrencyModule,
    DepositModule,
    RpcConnectionModule,
    NftMetadataModule,
    TokensModule,
    NftModule,
    LootboxTokensModule,
  ],
})
export class AppModule {}
