import { Module } from '@nestjs/common';

import { NftService } from '@@nft/nft.service';

@Module({
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
