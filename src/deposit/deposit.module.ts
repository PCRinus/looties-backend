import { Module } from '@nestjs/common';

import { CurrencyModule } from '@@currency/currency.module';
import { DepositController } from '@@deposit/deposit.controller';
import { DepositService } from '@@deposit/deposit.service';
import { NftModule } from '@@nft/nft.module';
import { NftMetadataModule } from '@@nft-metadata/nft-metadata.module';
import { RpcConnectionModule } from '@@rpc-connection/rpc-connection.module';
import { TokensModule } from '@@tokens/tokens.module';
import { TransactionsModule } from '@@transactions/transactions.module';

@Module({
  imports: [RpcConnectionModule, CurrencyModule, TokensModule, NftModule, NftMetadataModule, TransactionsModule],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
