import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

type ProfilePage = Omit<Profile, 'id' | 'userName' | 'xp' | 'level' | 'createdAt' | 'updatedAt' | 'userId'>;
type ProfileCard = Pick<Profile, 'userName' | 'level' | 'xp' | 'createdAt'>;

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

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

  async updateUsername(userId: string, username: string): Promise<void> {
    this.logger.log(`Updating username for user with id ${userId}`);

    try {
      await this.prismaService.profile.update({
        where: {
          userId,
        },
        data: {
          userName: username,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update username for user with id ${userId}`);
    }
  }
}
