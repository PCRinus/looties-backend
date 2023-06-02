import { GameHistoryService } from '@game-history/game-history.service';
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('game-history')
@Controller('game-history')
export class GameHistoryController {
  constructor(private readonly gameHistoryService: GameHistoryService) {}

  @Get(':userId')
  async getGameHistoryByUserId(@Param('userId') userId: string) {
    return await this.gameHistoryService.getGameHistoryByUserId(userId);
  }
}
