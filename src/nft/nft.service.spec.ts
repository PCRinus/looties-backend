import type { DeepMocked } from '@golevelup/ts-jest';
import { createMock } from '@golevelup/ts-jest';
import { type Nft, PublicKey } from '@metaplex-foundation/js';
import { InternalServerErrorException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Nfts } from '@prisma/client';
import Decimal from 'decimal.js';

import { NftService } from '@@nft/nft.service';
import { NftMetadataService } from '@@nft-metadata/nft-metadata.service';
import { PrismaService } from '@@shared/prisma.service';

describe('NftService', () => {
  let nftService: NftService;
  let nftMetadataService: DeepMocked<NftMetadataService>;
  let prisma: DeepMocked<PrismaService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NftService,
        { provide: NftMetadataService, useValue: createMock() },
        { provide: PrismaService, useValue: createMock() },
      ],
    }).compile();

    nftService = module.get<NftService>(NftService);
    nftMetadataService = module.get(NftMetadataService);
    prisma = module.get(PrismaService);
  });

  const mockUserId = 'mockUserId';

  const mockedNft: Nfts = {
    id: 'mockNftId',
    mintAddress: 'mockMintAddress',
    name: 'mockName',
    symbol: 'mockSymbol',
    url: 'mockUrl',
    price: new Decimal(100),
    userId: 'mockUserId',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockedNftList: Nfts[] = [mockedNft];

  const mockPublicKeyInput = '5xot9PVkphiX2adznghwrAuxGs2zeWisNSxMW6hU6Hkj';
  const mockedNftMetadata: Partial<Nft> = {
    address: new PublicKey(mockPublicKeyInput),
    name: 'mockedNftName',
    symbol: 'mockedNftSymbol',
    uri: 'mockedNftUrl',
  };

  describe('getNfts', () => {
    it('should return an empty list of no NFTs are found for a user', async () => {
      const mockedEmptyNftList = [];
      prisma.nfts.findMany = jest.fn().mockResolvedValue(mockedEmptyNftList);

      const result = await nftService.getNfts('mockUserId');
      expect(result).toBe(mockedEmptyNftList);
    });

    it('should return a list of NFTs for a user', async () => {
      prisma.nfts.findMany = jest.fn().mockResolvedValue(mockedNftList);

      const result = await nftService.getNfts('mockUserId');
      expect(result).toBe(mockedNftList);
    });
  });

  describe('deposit', () => {
    it('should throw an Internal Server Error if depositing throws', async () => {
      prisma.nfts.create = jest.fn().mockRejectedValue(undefined);
      const result = nftService.deposit(mockUserId, {} as Nft);

      expect(result).rejects.toThrowError(
        new InternalServerErrorException(`Error while depositing NFT for user ${mockUserId}`),
      );
    });

    it('should deposit an NFT', async () => {
      prisma.nfts.create = jest.fn().mockResolvedValue(mockedNft);
      const result = await nftService.deposit(mockUserId, mockedNftMetadata as Nft);

      expect(result).toBe(mockedNft);
    });
  });
});
