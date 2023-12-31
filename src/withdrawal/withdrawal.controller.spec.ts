import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NftService } from '@@nft/nft.service';
import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { SharedModule } from '@@shared/shared.module';
import { TokensService } from '@@tokens/tokens.service';
import { TransactionsService } from '@@transactions/transactions.service';
import { UserService } from '@@user/user.service';
import { WithdrawalController } from '@@withdrawal/withdrawal.controller';
import { WithdrawalService } from '@@withdrawal/withdrawal.service';

describe('WithdrawalController', () => {
  let controller: WithdrawalController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, HttpModule, JwtModule, ConfigModule],
      controllers: [WithdrawalController],
      providers: [
        WithdrawalService,
        TransactionsService,
        UserService,
        TokensService,
        RpcConnectionService,
        NftService,
        NftMetadataService,
      ],
    }).compile();

    controller = module.get<WithdrawalController>(WithdrawalController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
