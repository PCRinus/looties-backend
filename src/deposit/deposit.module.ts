import { Module } from '@nestjs/common';

import { CurrencyModule } from '@@currency/currency.module';
import { DepositController } from '@@deposit/deposit.controller';
import { DepositService } from '@@deposit/deposit.service';
import { ItemModule } from '@@item/item.module';
import { NftMetadataModule } from '@@nft-metadata/nft-metadata.module';
import { RpcConnectionModule } from '@@rpc-connection/rpc-connection.module';
import { TransactionsModule } from '@@transactions/transactions.module';

@Module({
  imports: [RpcConnectionModule, CurrencyModule, ItemModule, NftMetadataModule, TransactionsModule],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
