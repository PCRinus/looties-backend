import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seed = async () => {
  const user1 = await prisma.user.create({
    data: {
      walletAddress: '0x1234567890123456789012345678901234567890',
    }
  })

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
