import type { DeepMocked } from '@golevelup/ts-jest';
import { createMock } from '@golevelup/ts-jest';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Nfts } from '@prisma/client';
import Decimal from 'decimal.js';

import { NftController } from '@@nft/nft.controller';
import { NftService } from '@@nft/nft.service';
import { SharedModule } from '@@shared/shared.module';

describe('NftController', () => {
  let nftController: NftController;
  let nftService: DeepMocked<NftService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule, JwtModule, ConfigModule],
      controllers: [NftController],
      providers: [
        {
          provide: NftService,
          useValue: createMock<NftService>(),
        },
      ],
    }).compile();

    nftController = module.get<NftController>(NftController);
    nftService = module.get(NftService);
  });

  describe('getNftsForUser', () => {
    it('should return an empty list if user has no deposited NFTs', async () => {
      const mockedEmptyNftList = [];
      nftService.getNfts.mockResolvedValue(mockedEmptyNftList);
      const result = await nftController.getNftsForUser('testUserId');

      expect(result).toBe(mockedEmptyNftList);
    });

    it('should return a list of NFTs', async () => {
      const mockedNftList: Nfts[] = [
        {
          id: 'mockNftId',
          mintAddress: 'mockMintAddress',
          name: 'mockName',
          symbol: 'mockSymbol',
          url: 'mockUrl',
          price: new Decimal(100),
          userId: 'mockUserId',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      nftService.getNfts.mockResolvedValue(mockedNftList);
      const result = await nftController.getNftsForUser('testUserId');

      expect(result).toBe(mockedNftList);
    });
  });
});
