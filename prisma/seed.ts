import { PrismaClient } from '@prisma/client';
import { generate } from 'referral-codes';
import { v5 as uuidv5 } from 'uuid';

const prisma = new PrismaClient();

type AdminUser = {
  walletAddress: string;
  userName: string;
};

const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341';
const ADMIN_WALLET_KEYS: AdminUser[] = [
  {
    walletAddress: '4oe4JNjQ9i2gN91p1cUKanpF4jcQb11ph3QUihcr5QeR',
    userName: 'Mircea Admin',
  },
  {
    walletAddress: 'GKeGVjvNDdJSmmpNU5e7TyGwVu8tt7YkiPzjQacSJLfM',
    userName: 'Andrei Admin',
  },
];

const seed = async () => {
  for (let i = 0; i < ADMIN_WALLET_KEYS.length; i++) {
    await prisma.user.create({
      data: {
        id: uuidv5(ADMIN_WALLET_KEYS[i].walletAddress, UUID_NAMESPACE),
        walletAddress: ADMIN_WALLET_KEYS[i].walletAddress,
        role: 'ADMIN',
        profile: {
          create: {
            userName: ADMIN_WALLET_KEYS[i].userName,
          },
        },
        tokens: {
          create: {
            amount: 100,
          },
        },
        referrer: {
          create: {
            referralCode: generate({
              length: 8,
              count: 1,
              prefix: 'looties-',
            })[0],
          },
        },
        userSettings: {
          create: {},
        },
      },
    });
  }
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
