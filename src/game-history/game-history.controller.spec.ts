import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryController } from './game-history.controller';
import { GameHistoryService } from '@game-history/game-history.service';
import { SharedModule } from '@shared/shared.module';

describe('GameHistoryController', () => {
  let controller: GameHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [GameHistoryController],
      providers: [GameHistoryService],
    }).compile();

    controller = module.get<GameHistoryController>(GameHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
