import { Test, TestingModule } from '@nestjs/testing';
import { GameResponsiblyController } from './game-responsibly.controller';
import { GameResponsiblyService } from '@game-responsibly/game-responsibly.service';
import { AppModule } from 'src/app.module';

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
