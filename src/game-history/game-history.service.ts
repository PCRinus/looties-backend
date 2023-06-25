import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import type { GameHistory } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class GameHistoryService {
  private readonly logger = new Logger(GameHistoryService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getGameHistoryByUserId(userId: string): Promise<GameHistory[]> {
    return await this.prisma.gameHistory.findMany({
      where: {
        userId,
      },
    });
  }

  async addGameToUserHistory(userId: string, betAmount: number, gameType: 'LOOTBOXES' | 'CLASSIC'): Promise<number> {
    try {
      const { id } = await this.prisma.gameHistory.create({
        data: {
          userId,
          betAmount,
          gameType,
        },
      });

      return id;
    } catch (error) {
      this.logger.error(`Failed to add game to user history for user with id ${userId}`);

      throw new InternalServerErrorException(error);
    }
  }
}
