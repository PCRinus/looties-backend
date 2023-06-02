import { Injectable } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { TransactionType } from '@profile/profile.controller';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfileByUserId(userId: string): Promise<Profile> {
    return await this.prismaService.profile.findFirst({
      where: {
        userId,
      },
    });
  }

  async getTransactionsByUserIdAndType(userId: string, type: TransactionType) {
    return await this.prismaService.transactions.findMany({
      where: {
        AND: [
          {
            userId,
          },
          {
            type,
          },
        ],
      },
    });
  }
}
