import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Lootbox, LootboxNfts, LootboxTokens } from '@prisma/client';
import Decimal from 'decimal.js';

import { LootboxNftsService } from '@@lootbox-nfts/lootbox-nfts.service';
import { LootboxTokensService } from '@@lootbox-tokens/lootbox-tokens.service';
import { NftService } from '@@nft/nft.service';
import { PrismaService } from '@@shared/prisma.service';
import { TokensService } from '@@tokens/tokens.service';

export const LOOTBOXES_PER_PAGE = 24;

export type LootboxContents = {
  nft: LootboxNfts;
  tokens?: LootboxTokens;
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
  data?: { id: string } & ({ url: string; name: string; price: Decimal } | { amount: Decimal });
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
    });

    if (!lootbox) {
      throw new NotFoundException(`Lootbox ${lootboxId} not found`);
    }

    return lootbox;
  }

  async getLootboxWithNftAndTokensById(lootboxId: string) {
    const lootboxWithNftAndTokens = await this.prisma.lootbox.findUnique({
      where: {
        id: lootboxId,
      },
      include: {
        nft: true,
        tokens: true,
      },
    });

    if (!lootboxWithNftAndTokens) {
      throw new NotFoundException(`Can't fetch contents for lootbox ${lootboxId}`);
    }

    if (!lootboxWithNftAndTokens.nft) {
      throw new InternalServerErrorException(`Lootbox ${lootboxId} needs to have an NFT`);
    }

    return lootboxWithNftAndTokens;
  }

  async getAllLootboxes(userId: string, page = 1): Promise<Lootbox[]> {
    const lootboxes = await this.prisma.lootbox.findMany({
      take: LOOTBOXES_PER_PAGE,
      skip: page * LOOTBOXES_PER_PAGE - LOOTBOXES_PER_PAGE,
    });

    if (userId) {
      return lootboxes.filter((lootbox) => lootbox.userId === userId);
    }

    return lootboxes;
  }

  async deleteLootbox(lootboxId: string, creatorId: string, openerId: string): Promise<void> {
    const { nft, tokens } = await this.getLootboxContents(lootboxId);

    if (nft) {
      await this.nftService.transferNftBetweenUsers(creatorId, openerId, nft.mintAddress);
      await this.lootboxNftService.removeNftFromLootbox(lootboxId);
    }

    if (tokens) {
      await this.tokensService.deposit(openerId, tokens.amount);
      await this.lootboxTokensService.removeTokensFromLootbox(lootboxId);
    }

    await this.prisma.lootbox.delete({ where: { id: lootboxId } });
  }

  async getLootboxContents(lootboxId: string): Promise<LootboxContents> {
    const lootboxWithNftAndTokens = await this.getLootboxWithNftAndTokensById(lootboxId);

    if (!lootboxWithNftAndTokens.nft) {
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      nft: lootboxWithNftAndTokens.nft!,
      tokens: lootboxWithNftAndTokens.tokens ?? undefined,
      emptyBoxChance: lootboxWithNftAndTokens.emptyBoxChance,
    };
  }

  async createLootbox(
    userId: string,
    name: string,
    price: Decimal,
    tokens: LootboxTokensDo,
    nft: LootboxNftDo,
    emptyBoxChance: Decimal,
  ): Promise<Lootbox> {
    if (!nft) {
      throw new BadRequestException('An NFT is required to create a lootbox');
    }

    if (!tokens) {
      this._logger.log(`No tokens were added in the lootbox`);
    }

    const newLootbox = await this.prisma.lootbox.create({
      data: {
        userId,
        name,
        price,
        emptyBoxChance,
        nftImage: nft.imageUrl,
      },
    });

    await this.addNftToLootbox(newLootbox.id, nft.id, nft.dropChance);
    await this.addTokensToLootbox(userId, newLootbox.id, tokens.amount, tokens.dropChance);

    return newLootbox;
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
    this._logger.log(`Trying lootbox ${lootboxId}...`);

    const lootbox = await this.getLootboxWithNftAndTokensById(lootboxId);
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

    await this.deleteLootbox(lootboxId, creatorId, openerId);

    return lootboxPrize;
  }
}
