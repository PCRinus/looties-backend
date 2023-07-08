import { Module } from '@nestjs/common';

import { RpcConnectionModule } from '@@rpc-connection/rpc-connection.module';
import { TokensController } from '@@tokens/tokens.controller';
import { TokensService } from '@@tokens/tokens.service';

@Module({
  imports: [RpcConnectionModule],
  controllers: [TokensController],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
