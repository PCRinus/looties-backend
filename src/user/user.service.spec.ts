import { createMock } from '@golevelup/ts-jest';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { NftService } from '@@nft/nft.service';
import { PrismaService } from '@@shared/prisma.service';
import { TokensService } from '@@tokens/tokens.service';
import { UserService } from '@@user/user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: createMock() },
        { provide: TokensService, useValue: createMock() },
        { provide: NftService, useValue: createMock() },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
