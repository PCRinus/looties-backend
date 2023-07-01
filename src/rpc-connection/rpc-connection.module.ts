import { Module } from '@nestjs/common';

import { RpcConnectionService } from './rpc-connection.service';

@Module({
  providers: [RpcConnectionService],
  exports: [RpcConnectionService],
})
export class RpcConnectionModule {}
