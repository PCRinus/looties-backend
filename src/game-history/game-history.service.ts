import { Injectable } from '@nestjs/common';
import type { GameHistory } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class GameHistoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getGameHistoryByUserId(userId: string): Promise<GameHistory[]> {
    return await this.prisma.gameHistory.findMany({
      where: {
        userId,
      },
    });
  }

  async addGameToUserHistory(userId: string, betAmount: number, gameType: 'LOOTBOXES' | 'CLASSIC'): Promise<any> {
    const { id } = await this.prisma.gameHistory.create({
      data: {
        userId,
        betAmount,
        gameType,
      },
    });

    return id;
  }
}
