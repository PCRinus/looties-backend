import { Module } from '@nestjs/common';

import { ItemModule } from '@@item/item.module';

import { LiveDropsGateway } from './live-drops.gateway';
import { LiveDropsService } from './live-drops.service';

@Module({
  imports: [ItemModule],
  providers: [LiveDropsGateway, LiveDropsService],
})
export class LiveDropsModule {}
