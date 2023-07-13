import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { LootboxNfts } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

export type LootboxNftDo = Pick<LootboxNfts, 'mintAddress' | 'name' | 'symbol' | 'url' | 'price'> & {
  dropChance: string;
};

@Injectable()
export class LootboxNftsService {
  private readonly _logger = new Logger(LootboxNftsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addNftToLootbox(lootboxId: string, nftData: LootboxNftDo): Promise<void> {
    this._logger.log(`Adding NFT with mint ${nftData.mintAddress} to lootbox ${lootboxId}...`);

    try {
      await this.prisma.lootboxNfts.create({
        data: {
          lootboxId,
          mintAddress: nftData.mintAddress,
          name: nftData.name,
          symbol: nftData.symbol,
          url: nftData.url,
          price: nftData.price,
          dropChance: nftData.dropChance,
        },
      });
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException(
        `Failed to add NFT with mint ${nftData.mintAddress} to lootbox ${lootboxId}`,
      );
    }
  }

  async removeNftFromLootbox(lootboxId: string): Promise<void> {
    this._logger.log(`Removing NFT from lootbox ${lootboxId}`);

    try {
      await this.prisma.lootboxNfts.delete({
        where: {
          lootboxId,
        },
      });
    } catch (error) {
      this._logger.log(`Failed to delete NFT ${lootboxId}`);
      throw new InternalServerErrorException(`Failed to remove NFT from lootbox ${lootboxId}`);
    }
  }
}
