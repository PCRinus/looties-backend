import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';
import { UserSettingsService } from '@@user-settings/user-settings.service';

type ProfileCoreData = Pick<Profile, 'userName' | 'level' | 'xp' | 'createdAt'>;

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  async getProfileCard(userId: string): Promise<ProfileCoreData> {
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

  async getProfileStats(userId: string): Promise<ProfileCoreData | Profile> {
    const hideStats = await this.userSettingsService.isHideStatsEnabled(userId);
    const profile = await this.prismaService.profile.findFirst({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    if (hideStats) {
      return {
        userName: profile.userName,
        level: profile.level,
        xp: profile.xp,
        createdAt: profile.createdAt,
      };
    }

    return profile;
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
