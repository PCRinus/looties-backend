import { Module } from '@nestjs/common';

import { CurrencyModule } from '@@currency/currency.module';
import { DepositController } from '@@deposit/deposit.controller';
import { DepositService } from '@@deposit/deposit.service';
import { ItemModule } from '@@item/item.module';
import { RpcConnectionModule } from '@@rpc-connection/rpc-connection.module';

@Module({
  imports: [RpcConnectionModule, CurrencyModule, ItemModule],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
