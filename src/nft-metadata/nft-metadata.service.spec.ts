import { ConfigModule } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { RpcConnectionService } from '@@rpc-connection/rpc-connection.service';

describe('NftMetadataService', () => {
  let service: NftMetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [NftMetadataService, RpcConnectionService],
    }).compile();

    service = module.get<NftMetadataService>(NftMetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
