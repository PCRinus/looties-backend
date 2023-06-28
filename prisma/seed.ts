import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

const seed = async () => {
  const userIds = await seedUsers();
  const inventoryIds = await seedInventories(userIds);

  await seedAffiliateLinks(userIds);
  await seedTransactions(userIds);
  const lootboxIds = await seedLootboxes();
  const itemIds = await seedItems(inventoryIds, lootboxIds);
  await seedLiveDrops(itemIds, lootboxIds);
};

const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';

const seedUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
        id: uuidv5('user1', UUID_NAMESPACE),
        walletAddress: '0x1234567890123456789012345678901234567890',
      },
      {
        id: uuidv5('user2', UUID_NAMESPACE),
        walletAddress: '0x1234567890123456789012345678901234567891',
        excludedUntil: DateTime.now().plus({ years: 1 }).toJSDate(),
      },
    ],
  });

  const userIds = await prisma.user.findMany({
    select: {
      id: true,
    },
  });

  return userIds.map((userId) => userId.id);
};

const seedInventories = async (userIds: string[]) => {
  await prisma.inventory.createMany({
    data: [
      {
        userId: userIds[0],
      },
      {
        userId: userIds[1],
      },
    ],
  });

  const inventoryIds = await prisma.inventory.findMany({
    select: {
      id: true,
    },
  });

  return inventoryIds.map((inventoryId) => inventoryId.id);
};

const seedAffiliateLinks = async (userIds: string[]) => {
  await prisma.affiliates.createMany({
    data: [
      {
        referrerId: userIds[0],
      },
      {
        referrerId: userIds[1],
      },
    ],
  });
};

const seedTransactions = async (userIds: string[]) => {
  await prisma.transactions.createMany({
    data: [
      {
        userId: userIds[0],
        type: 'DEPOSIT',
        status: 'APPROVED',
      },
      {
        userId: userIds[0],
        type: 'DEPOSIT',
        status: 'DECLINED',
      },
      {
        userId: userIds[0],
        type: 'DEPOSIT',
      },
      {
        userId: userIds[0],
        type: 'WITHDRAWAL',
        status: 'APPROVED',
      },
      {
        userId: userIds[1],
        type: 'DEPOSIT',
        status: 'APPROVED',
      },
      {
        userId: userIds[1],
        type: 'DEPOSIT',
        status: 'DECLINED',
      },
      {
        userId: userIds[1],
        type: 'DEPOSIT',
      },
      {
        userId: userIds[1],
        type: 'WITHDRAWAL',
        status: 'APPROVED',
      },
    ],
  });
};

const seedLootboxes = async () => {
  await prisma.lootbox.createMany({
    data: [
      {
        id: uuidv5('lootbox1', UUID_NAMESPACE),
        price: 1000,
      },
      {
        id: uuidv5('lootbox2', UUID_NAMESPACE),
        price: 2000,
      },
      {
        id: uuidv5('lootbox3', UUID_NAMESPACE),
        price: 5000,
      },
    ],
  });

  const lootboxIds = await prisma.lootbox.findMany({
    select: {
      id: true,
    },
  });

  return lootboxIds.map((lootboxId) => lootboxId.id);
};

const seedItems = async (inventoryIds: string[], lootboxIds: string[]) => {
  await prisma.item.createMany({
    data: [
      {
        id: uuidv5('item1', UUID_NAMESPACE),
        name: 'Item 1',
        dropChance: 0.1,
        price: 100,
        type: 'NFT',
        highestPrice: 100,
        lowestPrice: 100,
        inventoryId: inventoryIds[0],
        lootboxId: lootboxIds[0],
      },
      {
        id: uuidv5('item2', UUID_NAMESPACE),
        name: 'Item 2',
        dropChance: 0.5,
        price: 200,
        type: 'NFT',
        highestPrice: 300,
        lowestPrice: 100,
        inventoryId: inventoryIds[0],
        lootboxId: lootboxIds[1],
      },
      {
        id: uuidv5('item3', UUID_NAMESPACE),
        name: 'Item 3',
        dropChance: 0.5,
        price: 150,
        type: 'NFT',
        highestPrice: 250,
        lowestPrice: 100,
        inventoryId: inventoryIds[1],
        lootboxId: lootboxIds[1],
      },
    ],
  });

  const itemIds = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  return itemIds.map((itemId) => itemId.id);
};

const seedLiveDrops = async (itemIds: string[], lootboxIds: string[]) => {
  await prisma.liveDrops.createMany({
    data: [
      {
        id: uuidv5('liveDrop1', UUID_NAMESPACE),
        itemId: itemIds[0],
        lootboxId: lootboxIds[0],
      },
      {
        id: uuidv5('liveDrop2', UUID_NAMESPACE),
        itemId: itemIds[1],
        lootboxId: lootboxIds[1],
      },
      {
        id: uuidv5('liveDrop3', UUID_NAMESPACE),
        itemId: itemIds[2],
        lootboxId: lootboxIds[1],
      },
    ],
  });
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
