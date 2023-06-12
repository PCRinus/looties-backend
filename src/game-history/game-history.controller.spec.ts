import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { GameHistoryService } from '@@game-history/game-history.service';
import { SharedModule } from '@@shared/shared.module';

import { GameHistoryController } from './game-history.controller';

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
