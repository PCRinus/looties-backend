import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Affiliates } from '@prisma/client';
import type Decimal from 'decimal.js';

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
          redeemers: {
            update: {
              where: {
                id: redeemerId,
              },
              data: {
                redeemedCode: referralCode,
              },
            },
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

  async claimAvailableCommission(
    userId: string,
    availableCommission: Decimal,
    referralEarnings: Decimal,
  ): Promise<void> {
    const totalReferralEarnings = referralEarnings.add(availableCommission);
    await this.prisma.affiliates.update({
      where: {
        referrerId: userId,
      },
      data: {
        availableCommission: {
          set: 0,
        },
        referralEarnings: {
          set: totalReferralEarnings,
        },
      },
    });
  }

  async getAffiliatesStats(
    userId: string,
  ): Promise<
    Pick<Affiliates, 'referralCode' | 'redeemedCount' | 'totalWagered' | 'referralEarnings' | 'availableCommission'>
  > {
    const stats = await this.prisma.affiliates.findUnique({
      where: {
        referrerId: userId,
      },
      select: {
        referralCode: true,
        redeemedCount: true,
        totalWagered: true,
        referralEarnings: true,
        availableCommission: true,
      },
    });

    if (!stats) {
      throw new NotFoundException(`Affiliate with user ID ${userId} not found`);
    }

    return stats;
  }

  async getReferrer(referralCode: string): Promise<string> {
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

    return affiliate.referrerId;
  }
}
