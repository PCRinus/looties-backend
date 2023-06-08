import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const seed = async () => {
  const userIds = await seedUsers();

  await seedTransactions(userIds);
};

const seedUsers = async () => {
  await prisma.user.createMany({
    data: [
      {
        walletAddress: '0x1234567890123456789012345678901234567890',
      },
      {
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

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
