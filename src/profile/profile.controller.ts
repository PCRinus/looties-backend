import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Profile } from '@prisma/client';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { Public } from '@@auth/public.decorator';
import { UpdateUsernameDto } from '@@profile/dtos/update-username.dto';
import { ProfileService } from '@@profile/profile.service';

type ProfileCoreData = {
  userName: string | null;
  level: number;
  xp: number;
  createdAt: Date;
};

type ProfileDo = Profile;
@ApiTags('Profile')
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiParam({ name: 'userId', description: 'The user ID of the profile to retrieve' })
  @Public()
  @Get(':userId')
  async getProfile(@Param('userId') userId: string): Promise<ProfileDo | ProfileCoreData> {
    const profile = await this.profileService.getProfileStats(userId);

    return profile;
  }

  @ApiParam({ name: 'userId', description: 'The user ID of the profile card to retrieve' })
  @Public()
  @Get(':userId/card')
  async getProfileCard(@Param('userId') userId: string): Promise<ProfileCoreData> {
    const profileCard = await this.profileService.getProfileCard(userId);

    return profileCard;
  }

  @ApiBearerAuth()
  @Post(':userId/username')
  async updateUsername(@Param('userId') userId: string, @Body() body: UpdateUsernameDto): Promise<void> {
    const { newUsername } = body;

    await this.profileService.updateUsername(userId, newUsername);
  }
}
