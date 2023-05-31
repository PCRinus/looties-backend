import { Test, TestingModule } from '@nestjs/testing';
import { GameResponsiblyController } from './game-responsibly.controller';

describe('GameResponsiblyController', () => {
  let controller: GameResponsiblyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameResponsiblyController],
    }).compile();

    controller = module.get<GameResponsiblyController>(GameResponsiblyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
