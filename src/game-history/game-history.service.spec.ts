import { Test, TestingModule } from '@nestjs/testing';
import { GameHistoryService } from './game-history.service';
import { SharedModule } from '@shared/shared.module';

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
