import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { GameHistoryService } from '@@game-history/game-history.service';

@ApiBearerAuth()
@ApiTags('Game History')
@UseGuards(AuthGuard)
@Controller('game-history')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Get(':userId')
  async getGameHistoryByUserId(@Param('userId') userId: string) {
    return await this.gameHistoryService.getGameHistoryByUserId(userId);
  }
}
