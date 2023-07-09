import { Injectable } from '@nestjs/common';
import type { Lootbox, Nfts } from '@prisma/client';
import type Decimal from 'decimal.js';

import { NftService } from '@@nft/nft.service';
import { PrismaService } from '@@shared/prisma.service';
import { TokensService } from '@@tokens/tokens.service';

export const LOOTBOXES_PER_PAGE = 24;

export type AvailableLootboxItems = {
  availableTokens: Decimal;
  availableNfts: Pick<Nfts, 'id' | 'name' | 'price' | 'url'>[];
};

@Injectable()
export class LootboxService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nftService: NftService,
    private readonly tokensService: TokensService,
  ) {}

  async getAllLootboxes(page = 1): Promise<Lootbox[]> {
    return await this.prisma.lootbox.findMany({
      take: LOOTBOXES_PER_PAGE,
      skip: page * LOOTBOXES_PER_PAGE - LOOTBOXES_PER_PAGE,
    });
  }

  async getLootboxesForUser(userId: string, page = 1): Promise<Lootbox[]> {
    return await this.prisma.lootbox.findMany({
      where: {
        userId,
      },
      take: LOOTBOXES_PER_PAGE,
      skip: page * LOOTBOXES_PER_PAGE - LOOTBOXES_PER_PAGE,
    });
  }

  async getAvailableLootboxItems(userId: string): Promise<AvailableLootboxItems> {
    const availableNfts = (await this.nftService.getNfts(userId)).map((nft) => ({
      id: nft.id,
      name: nft.name,
      price: nft.price,
      url: nft.url,
    }));
    const availableTokens = await this.tokensService.getBalance(userId);

    return {
      availableTokens,
      availableNfts,
    };
  }
}
