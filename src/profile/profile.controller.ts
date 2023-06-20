import { Controller, Get, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { ProfileService } from '@@profile/profile.service';

type Profile = {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  winRatio: number;
  lootboxesOpened: number;
  totalWagered: Decimal;
  netProfit: Decimal;
  twitterLink: string | null;
  discordLink: string | null;
};

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiParam({ name: 'userId', description: 'The user ID of the profile to retrieve' })
  @Get(':userId')
  async getProfile(@Param('userId') userId: string): Promise<Profile> {
    const profile = await this.profileService.getProfileByUserId(userId);

    return profile;
  }
}
