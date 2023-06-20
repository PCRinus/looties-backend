import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

type ProfilePage = Omit<Profile, 'id' | 'userName' | 'xp' | 'level' | 'createdAt' | 'updatedAt' | 'userId'>;

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfileByUserId(userId: string): Promise<ProfilePage> {
    const profile = await this.prismaService.profile.findFirst({
      where: {
        userId,
      },
      select: {
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        winRatio: true,
        lootboxesOpened: true,
        totalWagered: true,
        netProfit: true,
        twitterLink: true,
        discordLink: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
