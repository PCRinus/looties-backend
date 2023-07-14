import { Module } from '@nestjs/common';

import { FileStorageModule } from '@@file-storage/file-storage.module';
import { ProfileController } from '@@profile/profile.controller';
import { ProfileService } from '@@profile/profile.service';
import { UserSettingsModule } from '@@user-settings/user-settings.module';

@Module({
  imports: [UserSettingsModule, FileStorageModule],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
