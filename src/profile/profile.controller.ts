import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import type Decimal from 'decimal.js';

import { UpdateUsernameDto } from '@@profile/dtos/update-username.dto';
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

type ProfileCard = {
  userName: string | null;
  level: number;
  xp: number;
  createdAt: Date;
};

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiParam({ name: 'userId', description: 'The user ID of the profile to retrieve' })
  @Get(':userId')
  async getProfile(@Param('userId') userId: string): Promise<Profile> {
    const profile = await this.profileService.getProfile(userId);

    return profile;
  }

  @ApiParam({ name: 'userId', description: 'The user ID of the profile card to retrieve' })
  @Get(':userId/card')
  async getProfileCard(@Param('userId') userId: string): Promise<ProfileCard> {
    const profileCard = await this.profileService.getProfileCard(userId);

    return profileCard;
  }

  @Post(':userId/username')
  async updateUsername(@Param('userId') userId: string, @Body() body: UpdateUsernameDto): Promise<void> {
    const { newUsername } = body;

    await this.profileService.updateUsername(userId, newUsername);
  }
}
