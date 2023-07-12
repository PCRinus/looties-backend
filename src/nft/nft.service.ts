import type { Nft } from '@metaplex-foundation/js';
import { PublicKey } from '@metaplex-foundation/js';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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

  async getNft(id: string): Promise<Nfts> {
    this.logger.log(`Fetching NFT with id ${id}`);

    const nft = await this.prisma.nfts.findUnique({
      where: {
        id,
      },
    });

    if (!nft) {
      throw new NotFoundException(`NFT with id ${id} has not been found`);
    }

    return nft;
  }

  async getNfts(userId: string): Promise<Nfts[]> {
    this.logger.log(`Fetching NFTs for user with id ${userId}...`);

    return await this.prisma.nfts.findMany({
      where: {
        userId,
        deleted: false,
        reservedInLootbox: false,
      },
    });
  }

  async deposit(userId: string, nftMetadata: Nft): Promise<Nfts> {
    this.logger.log(`Depositing NFT with address ${nftMetadata.address.toBase58()}...`);
    try {
      return await this.prisma.nfts.upsert({
        where: {
          mintAddress: nftMetadata.address.toBase58(),
        },
        create: {
          userId,
          mintAddress: nftMetadata.address.toBase58(),
          name: nftMetadata.name,
          symbol: nftMetadata.symbol,
          url: nftMetadata.json?.image ?? 'https://cdn-icons-png.flaticon.com/256/25/25333.png',
          price: 0,
        },
        update: {
          deleted: false,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        `Error while depositing NFT ${nftMetadata.address.toBase58()} for user ${userId}`,
      );
    }
  }

  async withdraw(userId: string, mintAddress: string): Promise<Nfts> {
    this.logger.log(`Depositing NFT with mint id ${mintAddress} for user ${userId}...`);
    try {
      return await this.prisma.nfts.update({
        where: {
          mintAddress,
        },
        data: {
          deleted: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(`Error while withdrawing NFT ${mintAddress} for user ${userId}`);
    }
  }

  async depositInLootbox(id: string): Promise<void> {
    await this.prisma.nfts.update({
      where: {
        id,
      },
      data: {
        reservedInLootbox: true,
      },
    });
  }

  async withdrawFromLootbox(id: string): Promise<void> {
    await this.prisma.nfts.update({
      where: {
        id,
      },
      data: {
        reservedInLootbox: false,
      },
    });
  }

  async transferNftBetweenUsers(senderUserId: string, receiverUserId: string, nftId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const nft = await tx.nfts.findUnique({
        where: {
          id: nftId,
        },
      });

      if (!nft) {
        throw new NotFoundException(`Nft ${nftId} can't be transferred, not found`);
      }

      if (nft.userId !== senderUserId) {
        throw new BadRequestException(
          `NFT ${nftId} can't be transferred from user ${senderUserId}, user does not own the NFT`,
        );
      }

      await tx.nfts.update({
        where: {
          id: nftId,
        },
        data: {
          userId: receiverUserId,
          deleted: false,
          reservedInLootbox: false,
        },
      });
    });
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
