import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { AffiliatesService } from '@@affiliates/affiliates.service';
import { ClaimAvailableCommissionDto } from '@@affiliates/dtos/claim-available-commission.dto';
import { RedeemReferralCodeDto } from '@@affiliates/dtos/redeem-referral-code.dto';
import { UpdateReferralCodeDto } from '@@affiliates/dtos/update-referral-code.dto';

type AffiliateStats = {
  redeemedCount: number;
  totalWagered: Decimal;
  referralEarnings: Decimal;
  availableCommission: Decimal;
};

@ApiTags('Affiliates')
@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliateService: AffiliatesService) {}

  @Post('redeem-referral-code')
  async redeemReferralCode(@Body() body: RedeemReferralCodeDto): Promise<void> {
    const { referralCode } = body;
    await this.affiliateService.redeemReferralCode('TODO', referralCode);
  }

  @Post('update-referral-code')
  async updateReferralCode(@Body() body: UpdateReferralCodeDto): Promise<string> {
    const userId = 'TODO';
    const { updatedReferralCode } = body;

    const updatedAffiliate = await this.affiliateService.updateReferralCode(userId, updatedReferralCode);

    return updatedAffiliate.referralCode;
  }

  @Post('claim-available-commission')
  async claimAvailableCommission(@Body() body: ClaimAvailableCommissionDto): Promise<void> {
    const { userId, availableCommission, referralEarnings } = body;

    await this.affiliateService.claimAvailableCommission(userId, availableCommission, referralEarnings);
  }

  @Get('stats')
  async getAffiliatesStats(): Promise<AffiliateStats> {
    const stats = await this.affiliateService.getAffiliatesStats('TODO');

    return stats;
  }
}
