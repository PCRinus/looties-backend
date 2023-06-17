import { Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/client';

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

  async getUserByWalletPublicKey(walletPublicKey: string) {
    return this.prisma.user.findUnique({
      //TODO: rename walletAddress to walletPublicKey in a migration script
      where: { walletAddress: walletPublicKey },
    });
  }
}
