import { Injectable, NotFoundException } from '@nestjs/common';
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
}
