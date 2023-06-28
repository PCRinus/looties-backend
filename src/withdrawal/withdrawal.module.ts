import { Module } from '@nestjs/common';

import { InventoryModule } from '@@inventory/inventory.module';
import { WithdrawalController } from '@@withdrawal/withdrawal.controller';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@Module({
  imports: [InventoryModule],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
