import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NftService } from '@@nft/nft.service';
import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { SharedModule } from '@@shared/shared.module';
import { TokensService } from '@@tokens/tokens.service';
import { TransactionsService } from '@@transactions/transactions.service';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

describe('WithdrawalService', () => {
  let service: WithdrawalService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, HttpModule, ConfigModule],
      providers: [
        WithdrawalService,
        TransactionsService,
        RpcConnectionService,
        TokensService,
        NftService,
        NftMetadataService,
      ],
    }).compile();

    service = module.get<WithdrawalService>(WithdrawalService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
