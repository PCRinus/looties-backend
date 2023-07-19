import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { AffiliatesService } from '@@affiliates/affiliates.service';
import { ApplyCommissionDto } from '@@affiliates/dtos/apply-commission.dto';
import { RedeemReferralCodeDto } from '@@affiliates/dtos/redeem-referral-code.dto';
import { UpdateReferralCodeDto } from '@@affiliates/dtos/update-referral-code.dto';
import { Public } from '@@auth/decorators/public.decorator';
import { AuthGuard } from '@@auth/guards/auth.guard';
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
@UseGuards(AuthGuard)
@Controller('affiliates')
export class AffiliatesController {
  constructor(private readonly affiliateService: AffiliatesService, private readonly userService: UserService) {}

  @ApiBearerAuth()
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

  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'The id of the user who will redeem a referral code' })
  @Post(':userId/redeem-referral-code')
  async redeemReferralCode(@Param('userId') userId: string, @Body() body: RedeemReferralCodeDto): Promise<void> {
    const { referralCode } = body;
    const referredUser = await this.userService.getUserById(userId);

    if (referredUser.redeemedCode) {
      throw new BadRequestException(`User with ID ${userId} has already redeemed a referral code`);
    }

    await this.affiliateService.redeemReferralCode(userId, referralCode);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'The id of the user who has created a referral code' })
  @Post(':userId/update-referral-code')
  async updateReferralCode(@Param('userId') userId: string, @Body() body: UpdateReferralCodeDto): Promise<string> {
    const { updatedReferralCode } = body;

    const updatedAffiliate = await this.affiliateService.updateReferralCode(userId, updatedReferralCode);

    return updatedAffiliate.referralCode;
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'userId', description: 'The id of the user who has created a referral code' })
  @Post(':userId/claim-available-commission')
  async claimAvailableCommission(@Param('userId') userId: string): Promise<void> {
    await this.affiliateService.claimAvailableCommission(userId);
  }

  @ApiParam({ name: 'userId', description: 'The id of the user who has created a referral code' })
  @Public()
  @Get(':userId/stats')
  async getAffiliatesStats(@Param('userId') userId: string): Promise<AffiliateStats> {
    const stats = await this.affiliateService.getAffiliatesStats(userId);

    return stats;
  }
}
