import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import type { Affiliates } from '@prisma/client';
import type Decimal from 'decimal.js';

import { PrismaService } from '@@shared/prisma.service';

export const AFFILIATE_COMMISSION_PERCENTAGE = 0.05;

@Injectable()
export class AffiliatesService {
  private readonly logger = new Logger(AffiliatesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createInitialReferralCode(userId: string): Promise<Affiliates> {
    this.logger.log(`Creating initial referral code for user with ID ${userId}`);

    try {
      return await this.prisma.affiliates.create({
        data: {
          referrerId: userId,
        },
      });
    } catch (error) {
      this.logger.error(`Error creating initial referral code for user with ID ${userId}: ${error}`);
      throw new InternalServerErrorException(`Error creating initial referral code for user with ID ${userId}`);
    }
  }

  async applyCommission(redeemedCode: string, wagerAmount: Decimal): Promise<void> {
    this.logger.log(`Applying commission for affiliate with referral code ${redeemedCode}`);

    const existingAffiliate = await this.prisma.affiliates.findUnique({
      where: {
        referralCode: redeemedCode,
      },
    });

    if (!existingAffiliate) {
      throw new BadRequestException(`Affiliate with referral code ${redeemedCode} does not exist`);
    }

    const commissionAmount = wagerAmount.mul(AFFILIATE_COMMISSION_PERCENTAGE);

    await this.prisma.affiliates.update({
      where: {
        referralCode: redeemedCode,
      },
      data: {
        availableCommission: {
          set: existingAffiliate.availableCommission.add(commissionAmount),
        },
      },
    });
  }

  async redeemReferralCode(redeemerId: string, referralCode: string): Promise<void> {
    this.logger.log(`Redeeming referral code ${referralCode}`);

    const isAvailable = await this.checkIfReferralCodeIsAvailable(redeemerId, referralCode);
    if (!isAvailable) {
      this.logger.warn(`Referral code ${referralCode} is not available to be redeemed by user with ID ${redeemerId}`);
      throw new BadRequestException(
        `Referral code ${referralCode} is not available to be redeemed by user with ID ${redeemerId}`,
      );
    }

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
            connect: {
              id: redeemerId,
            },
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
    this.logger.log(`Updating referral code for affiliate with user ID ${userId}`);

    return await this.prisma.affiliates.update({
      where: {
        referrerId: userId,
      },
      data: {
        referralCode: newReferralCode,
      },
    });
  }

  async claimAvailableCommission(userId: string): Promise<void> {
    this.logger.log(`Claiming available commission for affiliate with user ID ${userId}`);

    const affiliateDo = await this.prisma.affiliates.findUnique({
      where: {
        referrerId: userId,
      },
    });

    if (!affiliateDo) {
      throw new NotFoundException(`Affiliate with user ID ${userId} not found`);
    }

    const { availableCommission, referralEarnings } = affiliateDo;

    if (availableCommission.isZero()) {
      throw new BadRequestException(`No available commission to claim for affiliate with user ID ${userId}`);
    }

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

  private async checkIfReferralCodeIsAvailable(userId: string, referralCode: string): Promise<boolean> {
    const affiliate = await this.prisma.affiliates.findUnique({
      where: {
        referralCode,
      },
    });

    if (!affiliate) {
      return false;
    }

    return affiliate.referrerId === userId ? false : true;
  }
}
