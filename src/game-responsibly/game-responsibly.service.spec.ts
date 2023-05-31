import { Test, TestingModule } from '@nestjs/testing';
import { GameResponsiblyService } from './game-responsibly.service';

describe('GameResponsiblyService', () => {
  let service: GameResponsiblyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameResponsiblyService],
    }).compile();

    service = module.get<GameResponsiblyService>(GameResponsiblyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
