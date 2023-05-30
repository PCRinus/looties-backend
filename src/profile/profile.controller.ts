import { Controller, Get, Param } from '@nestjs/common';
import { ProfileService } from '@profile/profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfile(@Param('userId') userId: string): Promise<any> {
    return await this.profileService.getProfileByUserId(userId);
  }
}
