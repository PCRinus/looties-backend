import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class GameResponsiblyService {
  constructor(private readonly prisma: PrismaService) {}

  async setSelfExclusionForUser(userId: string, timePeriodDays: number): Promise<void> {
    // await this.prisma.user.update({
    //   where: { id: userId },
    //   data: {

    //   }
    // })
  }
}
