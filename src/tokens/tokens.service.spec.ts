import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { SharedModule } from '@@shared/shared.module';
import { TokensService } from '@@tokens/tokens.service';

describe('TokensService', () => {
  let service: TokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, ConfigModule],
      providers: [TokensService, RpcConnectionService],
    }).compile();

    service = module.get<TokensService>(TokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
