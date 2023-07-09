import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import type { Lootbox, Nfts } from '@prisma/client';
import type Decimal from 'decimal.js';

import { LootboxNftsService } from '@@lootbox-nfts/lootbox-nfts.service';
import { LootboxTokensService } from '@@lootbox-tokens/lootbox-tokens.service';
import { NftService } from '@@nft/nft.service';
import { PrismaService } from '@@shared/prisma.service';
import { TokensService } from '@@tokens/tokens.service';

export const LOOTBOXES_PER_PAGE = 24;

export type AvailableLootboxItems = {
  availableTokens: Decimal;
  availableNfts: Pick<Nfts, 'id' | 'name' | 'price' | 'url'>[];
};

type LootboxTokensDo = {
  id: string;
  amount: Decimal;
  dropChance: Decimal;
};

type LootboxNftDo = {
  id: string;
  dropChance: string;
};

@Injectable()
export class LootboxService {
  private readonly _logger = new Logger(LootboxService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly nftService: NftService,
    private readonly lootboxNftService: LootboxNftsService,
    private readonly tokensService: TokensService,
    private readonly lootboxTokensService: LootboxTokensService,
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

  async createLootbox(
    userId: string,
    name: string,
    price: Decimal,
    tokens: LootboxTokensDo,
    nft: LootboxNftDo,
  ): Promise<void> {
    if (!nft) {
      throw new BadRequestException('An NFT is required to create a lootbox');
    }

    if (!tokens) {
      this._logger.log(`No tokens were added in the lootbox`);
    }

    const { id: newLootboxId } = await this.prisma.lootbox.create({
      data: {
        userId,
        name,
        price,
      },
      select: {
        id: true,
      },
    });

    await this.addNftToLootbox(userId, newLootboxId, nft.id, nft.dropChance);
    await this.addTokensToLootbox(userId, newLootboxId, tokens.amount, tokens.dropChance);
  }

  private async addTokensToLootbox(
    userId: string,
    lootboxId: string,
    amount: Decimal,
    dropChance: Decimal,
  ): Promise<void> {
    await this.lootboxTokensService.addTokensToLootbox(lootboxId, amount, dropChance);
    await this.tokensService.withdraw(userId, amount);
  }

  private async addNftToLootbox(userId: string, lootboxId: string, nftId: string, dropChance: string): Promise<void> {
    const nft = await this.nftService.getNft(nftId);

    await this.lootboxNftService.addNftToLootbox(lootboxId, { ...nft, dropChance });
  }
}
