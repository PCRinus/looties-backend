import { Injectable } from '@nestjs/common';
import type { LiveDrops } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class LiveDropsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDrops(limit = 50): Promise<LiveDrops[]> {
    return await this.prisma.liveDrops.findMany({
      take: limit,
    });
  }

  async saveDropData(itemId: string, lootboxId: string): Promise<LiveDrops> {
    return await this.prisma.liveDrops.create({
      data: {
        itemId,
        lootboxId,
      },
    });
  }
}
