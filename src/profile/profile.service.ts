import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

type ProfilePage = Omit<Profile, 'id' | 'userName' | 'xp' | 'level' | 'createdAt' | 'updatedAt' | 'userId'>;
type ProfileCard = Pick<Profile, 'userName' | 'level' | 'xp' | 'createdAt'>;

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfile(userId: string): Promise<ProfilePage> {
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

  async getProfileCard(userId: string): Promise<ProfileCard> {
    const profileCard = await this.prismaService.profile.findFirst({
      where: {
        userId,
      },
      select: {
        userName: true,
        level: true,
        xp: true,
        createdAt: true,
      },
    });

    if (!profileCard) {
      throw new NotFoundException('Profile card not found');
    }

    return profileCard;
  }
}
