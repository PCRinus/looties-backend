import { Module } from '@nestjs/common';

import { CurrencyModule } from '@@currency/currency.module';
import { InventoryModule } from '@@inventory/inventory.module';
import { WithdrawalController } from '@@withdrawal/withdrawal.controller';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@Module({
  imports: [InventoryModule, CurrencyModule],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
