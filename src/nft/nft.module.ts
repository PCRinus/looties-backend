import { Module } from '@nestjs/common';

import { NftController } from '@@nft/nft.controller';
import { NftService } from '@@nft/nft.service';

@Module({
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
