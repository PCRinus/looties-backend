import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Lootbox, LootboxNfts, LootboxTokens, Nfts } from '@prisma/client';
import assertNever from 'assert-never';
import Decimal from 'decimal.js';

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

export type LootboxContents = {
  tokens: LootboxTokens;
  nft: LootboxNfts;
  emptyBoxChance: Decimal;
};

type LootboxTokensDo = {
  id: string;
  amount: Decimal;
  dropChance: Decimal;
};

type LootboxNftDo = {
  id: string;
  imageUrl: string;
  dropChance: string;
};

type LootboxPrize = 'NFT' | 'TOKEN' | 'EMPTY_BOX';

export type LootboxPrizeDo = {
  prize: LootboxPrize;
  data?: any;
};

type OpenLootboxDo = {
  lootboxId: string;
  creatorId: string;
  price: Decimal;
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

  async getLootboxById(lootboxId: string): Promise<Lootbox> {
    const lootbox = await this.prisma.lootbox.findUnique({
      where: {
        id: lootboxId,
      },
      include: {
        nft: true,
        tokens: true,
      },
    });

    if (!lootbox) {
      throw new NotFoundException(`Lootbox ${lootboxId} not found`);
    }

    return lootbox;
  }

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

  async getLootboxContents(lootboxId: string): Promise<LootboxContents> {
    const lootboxContents = await this.prisma.lootbox.findUnique({
      where: {
        id: lootboxId,
      },
      include: {
        nft: true,
        tokens: true,
      },
    });

    if (!lootboxContents) {
      throw new InternalServerErrorException(`Lootbox ${lootboxId} can't be found`);
    }

    const tokens = lootboxContents.tokens;
    const nft = lootboxContents.nft;

    if (!tokens || !nft) {
      throw new Error();
    }

    return {
      nft,
      tokens,
      emptyBoxChance: lootboxContents.emptyBoxChance,
    };
  }

  async createLootbox(
    userId: string,
    name: string,
    price: Decimal,
    tokens: LootboxTokensDo,
    nft: LootboxNftDo,
    emptyBoxChance: Decimal,
  ): Promise<string> {
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
        emptyBoxChance,
        nftImage: nft.imageUrl,
      },
      select: {
        id: true,
      },
    });

    await this.addNftToLootbox(newLootboxId, nft.id, nft.dropChance);
    await this.addTokensToLootbox(userId, newLootboxId, tokens.amount, tokens.dropChance);

    return newLootboxId;
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

  private async addNftToLootbox(lootboxId: string, nftId: string, dropChance: string): Promise<void> {
    const nft = await this.nftService.getNft(nftId);

    await this.lootboxNftService.addNftToLootbox(lootboxId, { ...nft, dropChance });
    await this.nftService.depositInLootbox(nftId);
  }

  async tryLootbox(lootboxId: string): Promise<LootboxPrizeDo> {
    const lootbox = await this.prisma.lootbox.findUnique({
      where: {
        id: lootboxId,
      },
      include: {
        nft: true,
        tokens: true,
      },
    });

    if (!lootbox) {
      throw new InternalServerErrorException(`Lootbox with id ${lootboxId} could not be found`);
    }

    const lootboxNft = lootbox.nft;
    const lootboxTokens = lootbox.tokens;

    if (!lootboxNft || !lootboxTokens) {
      throw new InternalServerErrorException(`No NFT or tokens were found for lootbox ${lootboxId}`);
    }

    if (!lootboxTokens.dropChance || !lootboxNft.dropChance) {
      throw new InternalServerErrorException(
        `Can't generate winner for lootbox ${lootboxId}, drop chances are missing`,
      );
    }

    const prize = this.generateLootboxPrize(lootboxTokens.dropChance, lootboxNft.dropChance, lootbox.emptyBoxChance);

    if (prize === 'EMPTY_BOX') {
      return {
        prize,
      };
    }

    return prize === 'NFT'
      ? {
          prize,
          data: {
            id: lootboxNft.id,
            url: lootboxNft.url,
            price: lootboxNft.price,
            name: lootboxNft.name,
          },
        }
      : {
          prize,
          data: {
            id: lootboxTokens.id,
            amount: lootboxTokens.amount,
          },
        };
  }

  private generateLootboxPrize(
    tokenDropChance: Decimal,
    nftDropChance: Decimal,
    emptyBoxChance: Decimal,
  ): LootboxPrize {
    const randomWinningNumber = new Decimal(Math.random() * 100);
    if (randomWinningNumber <= emptyBoxChance) {
      return 'EMPTY_BOX';
    }

    const tokenDiff = randomWinningNumber.sub(tokenDropChance).abs();
    const nftDiff = randomWinningNumber.sub(nftDropChance).abs();

    if (tokenDiff < nftDiff) {
      return 'TOKEN';
    }

    return 'NFT';
  }

  async openLootbox(openerId: string, openLootboxDo: OpenLootboxDo): Promise<LootboxPrizeDo> {
    const { lootboxId, creatorId, price } = openLootboxDo;

    const lootboxPrize = await this.tryLootbox(lootboxId);

    await this.tokensService.transferTokensBetweenUsers(openerId, creatorId, price);

    if (lootboxPrize.prize === 'EMPTY_BOX') {
      return lootboxPrize;
    }

    const { nft, tokens } = await this.getLootboxContents(lootboxId);

    if (lootboxPrize.prize === 'NFT') {
      await this.nftService.transferNftBetweenUsers(creatorId, openerId, nft.id);
      await this.lootboxNftService.removeNftFromLootbox(lootboxId);

      return lootboxPrize;
    }

    if (lootboxPrize.prize === 'TOKEN') {
      await this.tokensService.deposit(openerId, tokens.amount);
      await this.lootboxTokensService.removeTokensFromLootbox(lootboxId);

      return lootboxPrize;
    }

    return assertNever(lootboxPrize.prize);
  }
}
