import { Module } from '@nestjs/common';

import { NftController } from '@@nft/nft.controller';
import { NftService } from '@@nft/nft.service';
import { NftMetadataModule } from '@@nft-metadata/nft-metadata.module';

@Module({
  imports: [NftMetadataModule],
  controllers: [NftController],
  providers: [NftService],
  exports: [NftService],
})
export class NftModule {}
