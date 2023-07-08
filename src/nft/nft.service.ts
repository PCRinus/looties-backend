import type { Nft } from '@metaplex-foundation/js';
import { PublicKey } from '@metaplex-foundation/js';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { Nfts } from '@prisma/client';

import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { PrismaService } from '@@shared/prisma.service';

type NftTransfer = {
  signature: string;
  blockhash: string;
  lastValidBlockHeight: number;
};

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);

  constructor(private readonly prisma: PrismaService, private readonly nftMetadataService: NftMetadataService) {}

  async getNfts(userId: string): Promise<Nfts[]> {
    this.logger.log(`Fetching NFTs for user with id ${userId}...`);

    return await this.prisma.nfts.findMany({
      where: {
        userId,
      },
    });
  }

  async deposit(userId: string, nftMetadata: Nft): Promise<Nfts> {
    this.logger.log(`Depositing NFT with mint id ${nftMetadata.address}...`);
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

  async signTransfer(mintAddress: PublicKey | string, receiver: PublicKey | string): Promise<NftTransfer> {
    const mintPublicKey = typeof mintAddress === 'string' ? new PublicKey(mintAddress) : mintAddress;
    const receiverPublicKey = typeof receiver === 'string' ? new PublicKey(receiver) : receiver;

    const nftMetadata = await this.nftMetadataService.getNftMetadata(mintPublicKey);

    const transferResponse = await this.nftMetadataService.transferNft(mintPublicKey, nftMetadata, receiverPublicKey);

    const { signature, blockhash, lastValidBlockHeight } = transferResponse;

    return {
      signature,
      blockhash,
      lastValidBlockHeight,
    };
  }
}
