import { Module } from '@nestjs/common';

import { ItemModule } from '@@item/item.module';
import { UserSettingsModule } from '@@user-settings/user-settings.module';

import { LiveDropsGateway } from './live-drops.gateway';
import { LiveDropsService } from './live-drops.service';

@Module({
  imports: [ItemModule, UserSettingsModule],
  providers: [LiveDropsGateway, LiveDropsService],
})
export class LiveDropsModule {}
