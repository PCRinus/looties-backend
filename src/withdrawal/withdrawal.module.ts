import { Module } from '@nestjs/common';

import { RpcConnectionModule } from '@@rpc-connection/rpc-connection.module';
import { TransactionsModule } from '@@transactions/transactions.module';
import { UserModule } from '@@user/user.module';
import { WithdrawalController } from '@@withdrawal/withdrawal.controller';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@Module({
  imports: [UserModule, TransactionsModule, RpcConnectionModule],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
