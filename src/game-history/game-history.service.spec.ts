import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { SharedModule } from '@@shared/shared.module';

import { GameHistoryService } from './game-history.service';

describe('GameHistoryService', () => {
  let service: GameHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [GameHistoryService],
    }).compile();

    service = module.get<GameHistoryService>(GameHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
