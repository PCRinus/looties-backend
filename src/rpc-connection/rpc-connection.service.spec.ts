import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { Connection } from '@solana/web3.js';

import { RpcConnectionService } from './rpc-connection.service';

describe('RpcConnectionService', () => {
  let rpcConnectionService: RpcConnectionService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RpcConnectionService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'SOLANA_RPC_ENDPOINT') {
                return 'https://api.devnet.solana.com';
              }

              return null;
            }),
          },
        },
      ],
    }).compile();

    rpcConnectionService = module.get<RpcConnectionService>(RpcConnectionService);

    rpcConnectionService.onModuleInit();
  });

  describe('getRpcConnection', () => {
    it('should return the RPC connection instance', async () => {
      const result = rpcConnectionService.getRpcConnection();

      expect(result).toBeInstanceOf(Connection);
    });
  });

  /**
   * @todo this calls the actual solana devnet connection, we need to mock this
   * @see https://stackoverflow.com/questions/70734188/how-to-mock-a-method-in-the-same-class-im-testing-in-nestjs-jest
   */
  describe('getLatestBlockhash', () => {
    it('should fetch the latest blockhash', async () => {
      const result = await rpcConnectionService.getLatestBlockhash();

      expect(result).toHaveProperty('blockhash');
      expect(result).toHaveProperty('lastValidBlockHeight');
    });
  });
});
