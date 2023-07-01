import { NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Item, PrismaClient } from '@prisma/client';
import { Decimal } from 'decimal.js';
import { type DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { ItemService } from '@@item/item.service';
import { PrismaService } from '@@shared/prisma.service';
import { SharedModule } from '@@shared/shared.module';

describe('ItemService', () => {
  let itemService: ItemService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [ItemService],
    })
      .overrideProvider(PrismaService)
      .useValue(
        mockDeep<PrismaClient>() as unknown as DeepMockProxy<{
          [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
        }>,
      )
      .compile();

    itemService = module.get<ItemService>(ItemService);
    prisma = module.get(PrismaService);
  });

  const mockItem: Item = {
    id: 'mockId',
    name: 'mockName',
    details: 'mockDetails',
    type: 'NFT',
    dropChance: new Decimal(0.5),
    price: new Decimal(100),
    lowestPrice: new Decimal(100),
    highestPrice: new Decimal(100),
    lootboxId: 'mockLootboxId',
    userId: 'mockInventoryId',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('selectItemLiveDropData', () => {
    it('should throw an error if no item is found', async () => {
      prisma.item.findUnique.mockResolvedValue(null);

      await expect(itemService.selectItemLiveDropData('id')).rejects.toThrowError(NotFoundException);
    });

    it('should return the item live drop data', async () => {
      const { id, name, dropChance, price, lootboxId, createdAt } = mockItem;
      prisma.item.findUnique.mockResolvedValue({
        id,
        name,
        dropChance,
        price,
        lootboxId,
        createdAt,
      } as Item);

      await expect(itemService.selectItemLiveDropData('id')).resolves.toEqual({
        id: mockItem.id,
        name: mockItem.name,
        dropChance: mockItem.dropChance,
        price: mockItem.price,
        lootboxId: mockItem.lootboxId,
        createdAt: mockItem.createdAt,
      });
    });
  });

  describe('selectItemsLiveDropsData', () => {
    it('should throw an error if no items are found', async () => {
      prisma.item.findMany.mockResolvedValue([]);

      await expect(itemService.selectItemsLiveDropsData(['id'])).rejects.toThrowError(NotFoundException);
    });

    it('should return the items live drop data', async () => {
      const { id, name, dropChance, price, lootboxId, createdAt } = mockItem;
      prisma.item.findMany.mockResolvedValue([
        {
          id,
          name,
          dropChance,
          price,
          lootboxId,
          createdAt,
        } as Item,
      ]);

      await expect(itemService.selectItemsLiveDropsData(['id'])).resolves.toEqual([
        {
          id: mockItem.id,
          name: mockItem.name,
          dropChance: mockItem.dropChance,
          price: mockItem.price,
          lootboxId: mockItem.lootboxId,
          createdAt: mockItem.createdAt,
        },
      ]);
    });
  });
});
