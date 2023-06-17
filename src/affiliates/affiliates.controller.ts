import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { AffiliatesService } from '@@affiliates/affiliates.service';
import { RedeemReferralCodeDto } from '@@affiliates/dtos/redeem-referral-code.dto';
import { UpdateReferralCodeDto } from '@@affiliates/dtos/update-referral-code.dto';

type AffiliateStats = {
  redeemedCount: number;
  availableCommission: Decimal;
};

@ApiTags('Affiliates')
@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliateService: AffiliatesService) {}

  @Post('redeem-referral-code')
  async redeemReferralCode(@Body() body: RedeemReferralCodeDto): Promise<void> {
    const { referralCode } = body;
    await this.affiliateService.redeemReferralCode(referralCode);
  }

  @Post('update-referral-code')
  async updateReferralCode(@Body() body: UpdateReferralCodeDto): Promise<string> {
    const userId = 'TODO';
    const { updatedReferralCode } = body;

    const updatedAffiliate = await this.affiliateService.updateReferralCode(userId, updatedReferralCode);

    return updatedAffiliate.referralCode;
  }

  @Get('stats')
  async getAffiliatesStats(): Promise<AffiliateStats> {
    return await this.affiliateService.getAffiliatesStats('TODO');
  }
}
