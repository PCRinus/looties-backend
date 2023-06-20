import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UpdateUserSettingsDto } from '@@user-settings/dtos/update-user-settings.dto';
import { UserSettingsService } from '@@user-settings/user-settings.service';

type UserSettings = {
  hideStats: boolean;
  isAnonymous: boolean;
  soundEffects: boolean;
  notifications: boolean;
};

@ApiTags('User settings')
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
