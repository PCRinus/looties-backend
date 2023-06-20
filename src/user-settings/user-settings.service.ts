import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('User settings not found');
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
}
