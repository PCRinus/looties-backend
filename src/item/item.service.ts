import { Injectable } from '@nestjs/common';
import { Item } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async selectItems(): Promise<any> {
    return await this.prisma.item.findMany();
  }

  async selectItemNameAndPriceById(id: string): Promise<Pick<Item, 'name' | 'price'>> {
    return await this.prisma.item.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        price: true,
      },
    });
  }
}
