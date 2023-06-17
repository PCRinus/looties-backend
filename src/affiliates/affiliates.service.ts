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
        totalWagered: true,
        availableCommission: true,
      },
    });

    if (!stats) {
      throw new NotFoundException(`Affiliate with user ID ${userId} not found`);
    }

    return stats;
  }

  async applyReferralBonusToReferrer(referralCode: string): Promise<any> {
    const affiliate = await this.prisma.affiliates.findUnique({
      where: {
        referralCode,
      },
      select: {
        referrerId: true,
      },
    });

    if (!affiliate) {
      throw new NotFoundException(`Referral code ${referralCode} not found`);
    }

    const referrerId = affiliate.referrerId;

    // TODO: with the referrerId, apply a percentage of the winnings from the redeemer to the referrer
  }
}
