import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Affiliates } from '@prisma/client';

import { PrismaService } from '@@shared/prisma.service';

@Injectable()
export class AffiliatesService {
  private readonly logger = new Logger(AffiliatesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async redeemReferralCode(redeemerId: string, referralCode: string): Promise<void> {
    this.logger.log(`Redeeming referral code ${referralCode}`);
    try {
      await this.prisma.affiliates.update({
        where: {
          referralCode,
        },
        data: {
          redeemedCount: {
            increment: 1,
          },
          referredUserIds: {
            push: redeemerId,
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error redeeming referral code ${referralCode}: ${error}`);
      throw new NotFoundException(`Affiliate with referral code ${referralCode} not found`);
    }
  }

  async updateReferralCode(userId: string, newReferralCode: string): Promise<Affiliates> {
    return await this.prisma.affiliates.update({
      where: {
        referrerId: userId,
      },
      data: {
        referralCode: newReferralCode,
      },
    });
  }

  async getAffiliatesStats(userId: string): Promise<Pick<Affiliates, 'redeemedCount' | 'availableCommission'>> {
    const stats = await this.prisma.affiliates.findUnique({
      where: {
        referrerId: userId,
      },
      select: {
        //TODO: Add the fields to be selected
        redeemedCount: true,
        availableCommission: true,
      },
    });

    if (!stats) {
      throw new NotFoundException(`Affiliate with user ID ${userId} not found`);
    }

    return stats;
  }

  // async updateTotalWagered(wagerAmount: Decimal): Promise<void> {

  // }
}
