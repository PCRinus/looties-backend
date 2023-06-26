import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { GameResponsiblyService } from '@@game-responsibly/game-responsibly.service';
import { SharedModule } from '@@shared/shared.module';

import { GameResponsiblyController } from './game-responsibly.controller';

describe('GameResponsiblyController', () => {
  let controller: GameResponsiblyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [GameResponsiblyController],
      providers: [GameResponsiblyService, JwtService, ConfigService],
    }).compile();

    controller = module.get<GameResponsiblyController>(GameResponsiblyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
