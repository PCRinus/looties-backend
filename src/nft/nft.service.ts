import type { Nft } from '@metaplex-foundation/js';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { Nfts } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);

  constructor(private readonly prisma: PrismaService) {}

  async deposit(userId: string, nftMetadata: Nft): Promise<Nfts> {
    try {
      return await this.prisma.nfts.create({
        data: {
          userId,
          mintAddress: nftMetadata.address.toBase58(),
          name: nftMetadata.name,
          symbol: nftMetadata.symbol,
          url: nftMetadata.uri,
          price: 0,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Error while depositing NFT for user ${userId}`);
    }
  }

  async withdraw(userId: string, mintAddress: string) {
    throw new Error('Not implemented yet');
  }
}
