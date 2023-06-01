import { Injectable } from '@nestjs/common';
import { LiveDrops } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class LiveDropsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDrops(): Promise<any> {
    return await this.prisma.liveDrops.findMany({
      take: 50,
    });
  }

  async saveDropData(itemId: string): Promise<LiveDrops> {
    return await this.prisma.liveDrops.create({
      data: {
        itemId,
      }
    })
  }
}
