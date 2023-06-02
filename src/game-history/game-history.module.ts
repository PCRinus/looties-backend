import { Module } from '@nestjs/common';
import { GameHistoryService } from './game-history.service';
import { GameHistoryController } from './game-history.controller';

@Module({
  providers: [GameHistoryService],
  controllers: [GameHistoryController]
})
export class GameHistoryModule {}
