import { Injectable, NotFoundException } from '@nestjs/common';
import type { Item } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async selectItems(userId: string): Promise<Item[]> {
    return await this.prisma.item.findMany({
      where: {
        userId,
      },
    });
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
}
