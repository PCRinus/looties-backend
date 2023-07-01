import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/client';
import { log } from 'console';
import { generate } from 'referral-codes';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getRedeemedReferralCode(userId: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        redeemedCode: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user.redeemedCode;
  }

  async getUserByWalletPublicKey(walletPublicKey: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      //TODO: rename walletAddress to walletPublicKey in a migration script
      where: { walletAddress: walletPublicKey },
    });

    if (!user) {
      throw new NotFoundException(`User with wallet public key ${walletPublicKey} not found`);
    }

    return user;
  }

  async getOrCreateUserByWalletPublicKey(walletPublicKey: string): Promise<User> {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        walletAddress: walletPublicKey,
      },
    });

    log('existingUser', existingUser);

    const formattedWalletPublicKey = `${walletPublicKey.slice(0, 5)}...${walletPublicKey.slice(-5)}`;

    if (!existingUser) {
      try {
        const newUser = await this.prisma.user.create({
          data: {
            walletAddress: walletPublicKey,
            profile: {
              create: {
                userName: formattedWalletPublicKey,
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
            UserSettings: {
              create: {},
            },
          },
        });

        return newUser;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }

    return existingUser;
  }
}
