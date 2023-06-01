import { Module } from '@nestjs/common';
import { LiveDropsGateway } from './live-drops.gateway';
import { LiveDropsService } from './live-drops.service';
import { ItemModule } from '@item/item.module';

@Module({
  imports: [ItemModule],
  providers: [LiveDropsGateway, LiveDropsService],
})
export class LiveDropsModule {}
