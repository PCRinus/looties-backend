import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { Item } from '@prisma/client';
import type Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class ItemService {
  private readonly logger = new Logger(ItemService.name);

  constructor(private readonly prisma: PrismaService) {}

  async selectItems(userId: string): Promise<Item[]> {
    return await this.prisma.item.findMany({
      where: {
        userId,
      },
    });
  }

  async selectTokens(userId: string): Promise<Item> {
    const tokens = await this.prisma.item.findUnique({
      where: {
        name: `tokens_${userId}`,
      },
    });

    if (!tokens) {
      throw new InternalServerErrorException(`Tokens for user id ${userId} could not be retrieved`);
    }

    return tokens;
  }

  async depositTokens(
    userId: string,
    amount: Decimal,
  ): Promise<Pick<Item, 'amount' | 'type' | 'name' | 'createdAt' | 'updatedAt'>> {
    try {
      return await this.prisma.item.upsert({
        where: {
          id: userId,
          name: `tokens_${userId}`,
        },
        update: {
          amount: {
            increment: amount,
          },
        },
        create: {
          type: 'TOKEN',
          name: `tokens_${userId}`,
          amount,
        },
        select: {
          amount: true,
          type: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to deposit tokens for user id ${userId}: ${error}`);
    }
  }

  async withdrawTokens(userId: string, amount: Decimal): Promise<void> {
    try {
      await this.prisma.item.update({
        where: {
          id: userId,
          name: `tokens_${userId}`,
        },
        data: {
          amount: {
            decrement: amount,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to withdraw tokens for user id ${userId}: ${error}`);
    }
  }

  async selectItemLiveDropData(
    itemId: string,
  ): Promise<Pick<Item, 'id' | 'name' | 'price' | 'lootboxId' | 'createdAt'>> {
    const item = await this.prisma.item.findUnique({
      where: {
        id: itemId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        lootboxId: true,
        createdAt: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    return item;
  }

  async selectItemsLiveDropsData(
    liveDropIds: string[],
  ): Promise<Pick<Item, 'id' | 'name' | 'price' | 'lootboxId' | 'createdAt'>[]> {
    const items = await this.prisma.item.findMany({
      where: {
        id: {
          in: liveDropIds,
        },
      },
      select: {
        id: true,
        name: true,
        price: true,
        lootboxId: true,
        createdAt: true,
      },
    });

    if (!items.length) {
      throw new NotFoundException('Item data not found');
    }

    return items;
  }

  async updateItem(itemId: string, data: Partial<Item>): Promise<Item> {
    try {
      return await this.prisma.item.update({
        where: {
          id: itemId,
        },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update item with data: ${error}`);
    }
  }
}
