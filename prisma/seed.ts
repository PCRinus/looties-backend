import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

const seed = async () => {
  const userIds = await seedUsers();
  const inventoryIds = await seedInventories(userIds);

  await seedTransactions(userIds);
  await seedMessages(userIds);
  const itemIds = await seedItems(inventoryIds);
  await seedLiveDrops(itemIds);
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

const seedTransactions = async (userIds: string[]) => {
  await prisma.transactions.createMany({
    data: [
      {
        userId: userIds[0],
        method: 'SOL',
        type: 'DEPOSIT',
        status: 'APPROVED',
      },
      {
        userId: userIds[0],
        method: 'SOL',
        type: 'DEPOSIT',
        status: 'DECLINED',
      },
      {
        userId: userIds[0],
        method: 'SOL',
        type: 'DEPOSIT',
      },
      {
        userId: userIds[0],
        method: 'SOL',
        type: 'WITHDRAWAL',
        status: 'APPROVED',
      },
      {
        userId: userIds[1],
        method: 'SOL',
        type: 'DEPOSIT',
        status: 'APPROVED',
      },
      {
        userId: userIds[1],
        method: 'SOL',
        type: 'DEPOSIT',
        status: 'DECLINED',
      },
      {
        userId: userIds[1],
        method: 'SOL',
        type: 'DEPOSIT',
      },
      {
        userId: userIds[1],
        method: 'SOL',
        type: 'WITHDRAWAL',
        status: 'APPROVED',
      },
    ],
  });
};

const seedMessages = async (userIds: string[]) => {
  const message1Id = uuidv5('message1', UUID_NAMESPACE);
  await prisma.message.createMany({
    data: [
      {
        id: message1Id,
        userId: userIds[0],
        message: 'Hello World',
        likedBy: [userIds[1]],
      },
      {
        id: uuidv5('message2', UUID_NAMESPACE),
        userId: userIds[1],
        message: 'Hello World Reply',
        repliedTo: message1Id,
      },
    ],
  });
};

const seedItems = async (inventoryIds: string[]) => {
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

const seedLiveDrops = async (itemIds: string[]) => {
  await prisma.liveDrops.createMany({
    data: [
      {
        id: uuidv5('liveDrop1', UUID_NAMESPACE),
        itemId: itemIds[0],
        lootboxId: uuidv5('lootbox1', UUID_NAMESPACE),
      },
      {
        id: uuidv5('liveDrop2', UUID_NAMESPACE),
        itemId: itemIds[1],
        lootboxId: uuidv5('lootbox1', UUID_NAMESPACE),
      },
      {
        id: uuidv5('liveDrop3', UUID_NAMESPACE),
        itemId: itemIds[2],
        lootboxId: uuidv5('lootbox2', UUID_NAMESPACE),
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
