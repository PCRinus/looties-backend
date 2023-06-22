import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { User } from '@prisma/client';
import { DateTime } from 'luxon';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class GameResponsiblyService {
  constructor(private readonly prisma: PrismaService) {}

  async isUserExcluded(userId: string): Promise<boolean> {
    const excludedUntilDo = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { excludedUntil: true },
    });

    if (!excludedUntilDo) {
      throw new InternalServerErrorException(`Could not find user with id ${userId}`);
    }

    const excludedUntil = excludedUntilDo.excludedUntil;

    if (!excludedUntil) {
      return false;
    }

    return DateTime.fromJSDate(excludedUntil) > DateTime.now();
  }

  async setSelfExclusionForUser(id: string, days: number): Promise<Pick<User, 'id' | 'excludedUntil'>> {
    const excludedUntil = DateTime.now().plus({ days });

    try {
      return await this.prisma.user.update({
        where: { id },
        data: {
          excludedUntil: excludedUntil.toJSDate(),
        },
        select: {
          id: true,
          excludedUntil: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(`Could not update exclusion for user ${id}`, error);
    }
  }
}
