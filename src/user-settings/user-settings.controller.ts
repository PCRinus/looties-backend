import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
}
