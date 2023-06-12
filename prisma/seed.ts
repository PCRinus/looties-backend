import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

const seed = async () => {
  const userIds = await seedUsers();

  await seedTransactions(userIds);
  await seedMessages(userIds);
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

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
