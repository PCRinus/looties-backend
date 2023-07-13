import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class LootboxTokensService {
  private readonly _logger = new Logger(LootboxTokensService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addTokensToLootbox(lootboxId: string, amount: Decimal, dropChance: Decimal): Promise<void> {
    this._logger.log(`Adding ${amount} tokens to lootbox ${lootboxId}...`);

    try {
      await this.prisma.lootboxTokens.create({
        data: {
          amount,
          dropChance,
          lootboxId,
        },
      });
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException(`Adding tokens to lootbox ${lootboxId} failed`);
    }
  }

  async removeTokensFromLootbox(lootboxId: string): Promise<void> {
    this._logger.log(`Removing tokens from lootbox ${lootboxId}...`);

    try {
      await this.prisma.lootboxTokens.delete({
        where: {
          lootboxId,
        },
      });
    } catch (error) {
      this._logger.error(error);
      throw new InternalServerErrorException(`Removing tokens from lootbox ${lootboxId} failed`);
    }
  }
}
