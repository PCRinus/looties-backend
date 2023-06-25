import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { UserSettings } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class UserSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserSettings(userId: string): Promise<UserSettings> {
    const settings = await this.prisma.userSettings.findUnique({
      where: {
        userId,
      },
    });

    if (!settings) {
      throw new InternalServerErrorException('User settings not found for user with id ${userId}');
    }

    return settings;
  }

  async updateUserSettings(userId: string, data: Partial<UserSettings>): Promise<void> {
    try {
      await this.prisma.userSettings.update({
        where: {
          userId,
        },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Failed to update user settings for user with id ${userId}`);
    }
  }

  async isHideStatsEnabled(userId: string): Promise<boolean> {
    const settings = await this.prisma.userSettings.findUnique({
      where: {
        userId,
      },
      select: {
        hideStats: true,
      },
    });

    if (!settings) {
      throw new InternalServerErrorException('User settings not found for user with id ${userId}');
    }

    return settings.hideStats;
  }

  async isAnonymousEnabled(userId: string): Promise<boolean> {
    const settings = await this.prisma.userSettings.findUnique({
      where: {
        userId,
      },
      select: {
        isAnonymous: true,
      },
    });

    if (!settings) {
      throw new InternalServerErrorException('User settings not found for user with id ${userId}');
    }

    return settings.isAnonymous;
  }
}
