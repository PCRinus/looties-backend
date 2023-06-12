import { Injectable, NotFoundException } from '@nestjs/common';
import type { Profile } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProfileByUserId(userId: string): Promise<Profile> {
    const profile = await this.prismaService.profile.findFirst({
      where: {
        userId,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }
}
