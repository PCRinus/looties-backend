import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import type { Profile } from '@prisma/client';
import { Express } from 'express';

import { AuthGuard } from '@@auth/guards/auth.guard';
import { Public } from '@@auth/public.decorator';
import { UpdateUsernameDto } from '@@profile/dtos/update-username.dto';
import { ProfileService } from '@@profile/profile.service';
import { UserSettingsService } from '@@user-settings/user-settings.service';

type ProfileCoreDo = {
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
  constructor(
    private readonly profileService: ProfileService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  @ApiParam({ name: 'userId', description: 'The user ID of the profile to retrieve' })
  @ApiBearerAuth()
  @Get(':userId')
  async getAuthenticatedUserProfile(@Param('userId') userId: string): Promise<ProfileDo | ProfileCoreDo> {
    const profile = await this.profileService.getProfileStats(userId, false);

    return profile;
  }

  @ApiParam({ name: 'userId', description: 'The user ID of the profile card to retrieve' })
  @Public()
  @Get(':userId/modal')
  async getProfileModalData(@Param('userId') userId: string): Promise<ProfileDo | ProfileCoreDo> {
    const hideStats = await this.userSettingsService.isHideStatsEnabled(userId);
    const profile = await this.profileService.getProfileStats(userId, hideStats);

    return profile;
  }

  @ApiBearerAuth()
  @Post(':userId/username')
  async updateUsername(@Param('userId') userId: string, @Body() body: UpdateUsernameDto): Promise<void> {
    const { newUsername } = body;

    await this.profileService.updateUsername(userId, newUsername);
  }

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        media: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @Post(':userId/avatar')
  async uploadAvatar(@Param('userId') userId: string, @UploadedFile() avatar: Express.Multer.File): Promise<string> {
    return await this.profileService.uploadAvatar(userId, avatar);
  }
}
