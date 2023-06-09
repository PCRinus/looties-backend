import { Injectable, NotFoundException } from '@nestjs/common';
import type { Item } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async selectItems(): Promise<any> {
    return await this.prisma.item.findMany();
  }

  async selectItemNameAndPriceById(id: string): Promise<Pick<Item, 'name' | 'price'>> {
    const item = await this.prisma.item.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        price: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return item;
  }
}
