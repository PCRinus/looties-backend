import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { PrismaClient } from '@prisma/client';
import type { DeepMockProxy } from 'jest-mock-extended';
import { mockDeep } from 'jest-mock-extended';

import { AffiliatesService } from '@@affiliates/affiliates.service';
import { PrismaService } from '@@shared/prisma.service';
import { SharedModule } from '@@shared/shared.module';

describe('AffiliatesService', () => {
  let service: AffiliatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [AffiliatesService],
    })
      .overrideProvider(PrismaService)
      .useValue(
        mockDeep<PrismaClient>() as unknown as DeepMockProxy<{
          [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
        }>,
      )
      .compile();

    service = module.get<AffiliatesService>(AffiliatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
