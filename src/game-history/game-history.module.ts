import { Module } from '@nestjs/common';

import { GameHistoryController } from './game-history.controller';
import { GameHistoryService } from './game-history.service';

@Module({
  providers: [GameHistoryService],
  controllers: [GameHistoryController],
  exports: [GameHistoryService],
})
export class GameHistoryModule {}
