import { Module } from '@nestjs/common';

import { GameResponsiblyController } from './game-responsibly.controller';
import { GameResponsiblyService } from './game-responsibly.service';

@Module({
  controllers: [GameResponsiblyController],
  providers: [GameResponsiblyService],
})
export class GameResponsiblyModule {}
