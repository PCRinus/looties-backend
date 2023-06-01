import { Test, TestingModule } from '@nestjs/testing';
import { GameResponsiblyService } from './game-responsibly.service';
import { AppModule } from 'src/app.module';

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
