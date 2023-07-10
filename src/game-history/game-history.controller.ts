import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { GameHistory } from '@prisma/client';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { GameHistoryService } from '@@game-history/game-history.service';

@ApiBearerAuth()
@ApiTags('Game History')
@UseGuards(AuthGuard)
@Controller('game-history')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Get(':userId')
  async getGameHistoryOffsetPagination(
    @Param('userId') userId: string,
    @Query('page') page: number,
  ): Promise<GameHistory[]> {
    return await this.gameHistoryService.getGameHistoryOffsetPagination(userId, page);
  }
}
