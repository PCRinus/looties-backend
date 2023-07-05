import { Module } from '@nestjs/common';

import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionModule } from '@@rpc-connection/rpc-connection.module';

@Module({
  imports: [RpcConnectionModule],
  providers: [NftMetadataService],
  exports: [NftMetadataService],
})
export class NftMetadataModule {}
