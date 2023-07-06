import { Module } from '@nestjs/common';

import { UserSettingsModule } from '@@user-settings/user-settings.module';

import { LiveDropsGateway } from './live-drops.gateway';
import { LiveDropsService } from './live-drops.service';

@Module({
  imports: [UserSettingsModule],
  providers: [LiveDropsGateway, LiveDropsService],
})
export class LiveDropsModule {}
