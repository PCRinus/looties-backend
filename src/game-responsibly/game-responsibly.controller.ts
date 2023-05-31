import { SetSelfExclusion } from '@game-responsibly/dtos/set-self-exclusion.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('game-responsibly')
export class GameResponsiblyController {
  @Post()
  async setSelfExclusion(@Body() setSelfExclusionDto: SetSelfExclusion): Promise<void> {
    const { timePeriodDays } = setSelfExclusionDto;
  }
}
