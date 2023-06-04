import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

import { GameResponsiblyService } from './game-responsibly.service';

describe('GameResponsiblyService', () => {
  let service: GameResponsiblyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [GameResponsiblyService],
    }).compile();

    service = module.get<GameResponsiblyService>(GameResponsiblyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
