import { Injectable, NotFoundException } from '@nestjs/common';
import type { Item, LiveDrops } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async selectItems(): Promise<Item[]> {
    return await this.prisma.item.findMany();
  }

  async selectItemLiveDropData(
    itemId: string,
  ): Promise<Pick<Item, 'id' | 'name' | 'dropChance' | 'price' | 'lootboxId'>> {
    const item = await this.prisma.item.findUnique({
      where: {
        id: itemId,
      },
      select: {
        id: true,
        dropChance: true,
        name: true,
        price: true,
        lootboxId: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${itemId} not found`);
    }

    return item;
  }

  async selectItemsLiveDropsData(
    liveDropIds: string[],
  ): Promise<Pick<Item, 'id' | 'name' | 'dropChance' | 'price' | 'lootboxId'>[]> {
    const items = await this.prisma.item.findMany({
      where: {
        id: {
          in: liveDropIds,
        },
      },
      select: {
        id: true,
        dropChance: true,
        name: true,
        price: true,
        lootboxId: true,
      },
    });

    if (!items.length) {
      throw new NotFoundException('Item data not found');
    }

    return items;
  }
}
