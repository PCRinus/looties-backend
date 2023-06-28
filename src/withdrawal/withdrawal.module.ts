import { Module } from '@nestjs/common';

import { CurrencyModule } from '@@currency/currency.module';
import { TransactionsModule } from '@@transactions/transactions.module';
import { UserModule } from '@@user/user.module';
import { WithdrawalController } from '@@withdrawal/withdrawal.controller';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@Module({
  imports: [UserModule, CurrencyModule, TransactionsModule],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
