import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  const user1 = await prisma.user.upsert({
    where: {
      email: 'user1@gmail.com',
    },
    update: {},
    create: {
      email: 'user1@gmail.com',
      password: '123456',
      passwordSalt: '123456',
      walletAddress: '0x123456789',
    },
  });

  console.log('Seeded user1', user1);
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
