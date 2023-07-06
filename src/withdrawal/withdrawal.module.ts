import { Module } from '@nestjs/common';

import { RpcConnectionModule } from '@@rpc-connection/rpc-connection.module';
import { TokensModule } from '@@tokens/tokens.module';
import { TransactionsModule } from '@@transactions/transactions.module';
import { UserModule } from '@@user/user.module';
import { WithdrawalController } from '@@withdrawal/withdrawal.controller';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

@Module({
  imports: [UserModule, TransactionsModule, RpcConnectionModule, TokensModule],
  controllers: [WithdrawalController],
  providers: [WithdrawalService],
})
export class WithdrawalModule {}
