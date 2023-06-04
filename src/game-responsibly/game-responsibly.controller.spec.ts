import { GameResponsiblyService } from '@game-responsibly/game-responsibly.service';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';

import { GameResponsiblyController } from './game-responsibly.controller';

describe('GameResponsiblyController', () => {
  let controller: GameResponsiblyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [GameResponsiblyController],
      providers: [GameResponsiblyService],
    }).compile();

    controller = module.get<GameResponsiblyController>(GameResponsiblyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
