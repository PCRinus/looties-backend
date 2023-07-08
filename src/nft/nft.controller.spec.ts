import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NftController } from '@@nft/nft.controller';
import { NftService } from '@@nft/nft.service';
import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';
import { SharedModule } from '@@shared/shared.module';

describe('NftController', () => {
  let controller: NftController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, JwtModule, ConfigModule],
      controllers: [NftController],
      providers: [NftService, NftMetadataService, RpcConnectionService],
    }).compile();

    controller = module.get<NftController>(NftController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
