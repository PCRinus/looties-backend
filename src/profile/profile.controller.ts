import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProfileService } from '@@profile/profile.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('userId') userId: string): Promise<any> {
    return await this.profileService.getProfileByUserId(userId);
  }
}
