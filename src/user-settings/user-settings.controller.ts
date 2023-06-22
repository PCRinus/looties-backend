import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from '@@auth/auth.guard';
import { UpdateUserSettingsDto } from '@@user-settings/dtos/update-user-settings.dto';
import { UserSettingsService } from '@@user-settings/user-settings.service';

type UserSettings = {
  hideStats: boolean;
  isAnonymous: boolean;
  soundEffects: boolean;
  notifications: boolean;
};

@ApiBearerAuth()
@ApiTags('User settings')
@UseGuards(AuthGuard)
@Controller('user-settings')
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get(':userId')
  async getUserSettings(@Param('userId') userId: string): Promise<UserSettings> {
    return this.userSettingsService.getUserSettings(userId);
  }

  @Post(':userId/update-settings')
  async updateUserSettings(@Param('userId') userId: string, @Body() body: UpdateUserSettingsDto): Promise<void> {
    this.userSettingsService.updateUserSettings(userId, body);
  }
}
