import { Module } from '@nestjs/common';

import { ProfileController } from '@@profile/profile.controller';
import { ProfileService } from '@@profile/profile.service';
import { UserSettingsModule } from '@@user-settings/user-settings.module';

@Module({
  imports: [UserSettingsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
