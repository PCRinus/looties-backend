import { PrismaClient } from '@prisma/client';
import { DateTime } from 'luxon';

const prisma = new PrismaClient();

const seed = async () => {
  const enabledUser = await prisma.user.create({
    data: {
      walletAddress: '0x1234567890123456789012345678901234567890',
    }
  })

  console.log('enabledUser', enabledUser);

  const excludedUser = await prisma.user.create({
    data: {
      walletAddress: '0x1234567890123456789012345678901234567891',
      excludedUntil: DateTime.now().plus({ years: 2 }).toJSDate(),
    }
  })

  console.log('excludedUser', excludedUser);
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
