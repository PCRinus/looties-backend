import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { RpcConnectionService } from './rpc-connection.service';

describe('RpcConnectionService', () => {
  let service: RpcConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [RpcConnectionService],
    }).compile();

    service = module.get<RpcConnectionService>(RpcConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
