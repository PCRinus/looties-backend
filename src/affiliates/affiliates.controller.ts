import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { AffiliatesService } from '@@affiliates/affiliates.service';
import { RedeemReferralCodeDto } from '@@affiliates/dtos/redeem-referral-code.dto';
import { UpdateReferralCodeDto } from '@@affiliates/dtos/update-referral-code.dto';

type AffiliateStats = {
  referralCode: string;
  redeemedCount: number;
  totalWagered: Decimal;
  referralEarnings: Decimal;
  availableCommission: Decimal;
};

@ApiTags('Affiliates')
@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliateService: AffiliatesService) {}

  @Post(':userId/redeem-referral-code')
  async redeemReferralCode(@Param('userId') userId: string, @Body() body: RedeemReferralCodeDto): Promise<void> {
    const { referralCode } = body;
    await this.affiliateService.redeemReferralCode(userId, referralCode);
  }

  @Post(':userId/update-referral-code')
  async updateReferralCode(@Param('userId') userId: string, @Body() body: UpdateReferralCodeDto): Promise<string> {
    const { updatedReferralCode } = body;

    const updatedAffiliate = await this.affiliateService.updateReferralCode(userId, updatedReferralCode);

    return updatedAffiliate.referralCode;
  }

  @Post(':userId/claim-available-commission')
  async claimAvailableCommission(@Param('userId') userId: string): Promise<void> {
    await this.affiliateService.claimAvailableCommission(userId);
  }

  @Get(':userId/stats')
  async getAffiliatesStats(@Param('userId') userId: string): Promise<AffiliateStats> {
    const stats = await this.affiliateService.getAffiliatesStats(userId);

    return stats;
  }
}
