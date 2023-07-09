import { Injectable } from '@nestjs/common';
import type { Lootbox } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

export const LOOTBOXES_PER_PAGE = 24;

@Injectable()
export class LootboxService {
  constructor(private readonly prisma: PrismaService) {}

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
}
