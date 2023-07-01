import { Test, TestingModule } from '@nestjs/testing';
import { RpcConnectionService } from './rpc-connection.service';

describe('RpcConnectionService', () => {
  let service: RpcConnectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RpcConnectionService],
    }).compile();

    service = module.get<RpcConnectionService>(RpcConnectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
