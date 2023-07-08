import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { SharedModule } from '@@shared/shared.module';
import { TokensController } from '@@tokens/tokens.controller';
import { TokensService } from '@@tokens/tokens.service';

describe('TokensController', () => {
  let controller: TokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, ConfigModule],
      controllers: [TokensController],
      providers: [TokensService, RpcConnectionService],
    }).compile();

    controller = module.get<TokensController>(TokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
