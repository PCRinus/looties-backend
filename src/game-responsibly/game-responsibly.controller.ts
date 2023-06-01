import { SetSelfExclusion } from '@game-responsibly/dtos/set-self-exclusion.dto';
import { GameResponsiblyService } from '@game-responsibly/game-responsibly.service';
import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Game responsibly')
@Controller('game-responsibly')
export class GameResponsiblyController {
  private readonly logger = new Logger(GameResponsiblyController.name);

  constructor(private readonly gameResponsiblyService: GameResponsiblyService) {}

  @Get(':userId')
  async isUserExcluded(@Param('userId') userId: string): Promise<boolean> {
    this.logger.log(`Checking if user ${userId} is excluded`);

    return await this.gameResponsiblyService.isUserExcluded(userId);
  }

  @Post()
  async setSelfExclusion(@Body() setSelfExclusionDto: SetSelfExclusion): Promise<any> {
    const { userId, timePeriodDays } = setSelfExclusionDto;
    this.logger.log(`Setting self exclusion for user ${userId} for ${timePeriodDays} days`);

    return await this.gameResponsiblyService.setSelfExclusionForUser(userId, timePeriodDays);
  }
}
