import { Module } from '@nestjs/common';

import { CurrencyModule } from '@@currency/currency.module';
import { InventoryModule } from '@@inventory/inventory.module';
import { TransactionsModule } from '@@transactions/transactions.module';
import { WithdrawalController } from '@@withdrawal/withdrawal.controller';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@Module({
  imports: [InventoryModule, CurrencyModule, TransactionsModule],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
