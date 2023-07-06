import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { PrismaClient } from '@prisma/client';
import type { DeepMockProxy } from 'jest-mock-extended';
import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from '@@shared/prisma.service';
import { SharedModule } from '@@shared/shared.module';

import { LiveDropsService } from './live-drops.service';

describe('LiveDropsService', () => {
  let liveDropsService: LiveDropsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [LiveDropsService],
    })
      .overrideProvider(PrismaService)
      .useValue(
        mockDeep<PrismaClient>() as unknown as DeepMockProxy<{
          [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
        }>,
      )
      .compile();

    liveDropsService = module.get<LiveDropsService>(LiveDropsService);
    prisma = module.get(PrismaService);
  });

  // TODO: Fix tests
  // describe('getDrops', () => {
  //   it('should return am empty list if no live drops are found', async () => {
  //     prisma.liveDrops.findMany.mockResolvedValue([]);

  //     await expect(liveDropsService.getDrops()).resolves.toEqual([]);
  //   });

  //   it('should return the maximum limit allowed', async () => {
  //     prisma.liveDrops.findMany.mockResolvedValue(
  //       Array.from({ length: 50 }, () => ({
  //         id: 'id',
  //         itemId: 'itemId',
  //         lootboxId: 'lootboxId',
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //       })),
  //     );

  //     await expect(liveDropsService.getDrops()).resolves.toHaveLength(50);
  //   });
  // });

  // describe('saveDropData', () => {
  //   it('should save the drop data', async () => {
  //     prisma.liveDrops.create.mockResolvedValue({
  //       id: 'id',
  //       itemId: 'itemId',
  //       lootboxId: 'lootboxId',
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     });

  //     await expect(liveDropsService.saveDropData('itemId', 'lootboxId')).resolves.toEqual({
  //       id: 'id',
  //       itemId: 'itemId',
  //       lootboxId: 'lootboxId',
  //       createdAt: expect.any(Date),
  //       updatedAt: expect.any(Date),
  //     });
  //   });
  // });
});
