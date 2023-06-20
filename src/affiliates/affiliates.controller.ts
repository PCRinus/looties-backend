import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { AffiliatesService } from '@@affiliates/affiliates.service';
import { ApplyCommissionDto } from '@@affiliates/dtos/apply-commission.dto';
import { RedeemReferralCodeDto } from '@@affiliates/dtos/redeem-referral-code.dto';
import { UpdateReferralCodeDto } from '@@affiliates/dtos/update-referral-code.dto';
import { UserService } from '@@user/user.service';

type AffiliateStats = {
  referralCode: string;
  redeemedCount: number;
  totalWagered: Decimal;
  referralEarnings: Decimal;
  availableCommission: Decimal;
};

@ApiTags('Affiliates')
@ApiCreatedResponse({ description: 'Affiliate commission was successfully applied' })
@ApiBadRequestResponse({ description: 'Given user has not redeemed a referral code' })
@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliateService: AffiliatesService, private readonly userService: UserService) {}

  @ApiParam({ name: 'userId', description: 'The id of the user who has redeemed a referral code' })
  @Post(':userId/apply-commission')
  async applyCommission(@Param('userId') userId: string, @Body() body: ApplyCommissionDto): Promise<void> {
    const { wagerAmount } = body;
    const referralCode = await this.userService.getRedeemedReferralCode(userId);

    if (!referralCode) {
      throw new BadRequestException(`User with ID ${userId} has not redeemed a referral code`);
    }

    await this.affiliateService.applyCommission(referralCode, wagerAmount);
  }

  @ApiParam({ name: 'userId', description: 'The id of the user who will redeem a referral code' })
  @Post(':userId/redeem-referral-code')
  async redeemReferralCode(@Param('userId') userId: string, @Body() body: RedeemReferralCodeDto): Promise<void> {
    const { referralCode } = body;
    await this.affiliateService.redeemReferralCode(userId, referralCode);
  }

  @ApiParam({ name: 'userId', description: 'The id of the user who has created a referral code' })
  @Post(':userId/update-referral-code')
  async updateReferralCode(@Param('userId') userId: string, @Body() body: UpdateReferralCodeDto): Promise<string> {
    const { updatedReferralCode } = body;

    const updatedAffiliate = await this.affiliateService.updateReferralCode(userId, updatedReferralCode);

    return updatedAffiliate.referralCode;
  }

  @ApiParam({ name: 'userId', description: 'The id of the user who has created a referral code' })
  @Post(':userId/claim-available-commission')
  async claimAvailableCommission(@Param('userId') userId: string): Promise<void> {
    await this.affiliateService.claimAvailableCommission(userId);
  }

  @ApiParam({ name: 'userId', description: 'The id of the user who has created a referral code' })
  @Get(':userId/stats')
  async getAffiliatesStats(@Param('userId') userId: string): Promise<AffiliateStats> {
    const stats = await this.affiliateService.getAffiliatesStats(userId);

    return stats;
  }
}
