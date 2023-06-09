import { Injectable } from '@nestjs/common';
import type { User } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';
import { DateTime } from 'luxon';

@Injectable()
export class GameResponsiblyService {
  constructor(private readonly prisma: PrismaService) {}

  async isUserExcluded(userId: string): Promise<any> {
    const excludedUntilDo = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { excludedUntil: true },
    });

    const excludedUntil = excludedUntilDo?.excludedUntil;

    if (!excludedUntil) return false;

    return DateTime.fromJSDate(excludedUntil) > DateTime.now();
  }

  async setSelfExclusionForUser(userId: string, days: number): Promise<User> {
    const excludedUntil = DateTime.now().plus({ days });

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        excludedUntil: excludedUntil.toJSDate(),
      },
    });
  }
}
