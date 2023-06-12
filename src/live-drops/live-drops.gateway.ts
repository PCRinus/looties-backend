import { UsePipes, ValidationPipe } from '@nestjs/common';
import type { OnGatewayConnection } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { ItemService } from '@@item/item.service';
import { ItemDroppedDto } from '@@live-drops/dtos/item-dropped.dto';
import { LiveDropsService } from '@@live-drops/live-drops.service';

@UsePipes(new ValidationPipe())
@WebSocketGateway(3002, { cors: true })
export class LiveDropsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly liveDropsService: LiveDropsService, private readonly itemService: ItemService) {}

  async handleConnection() {
    const liveDrops = await this.liveDropsService.getDrops();
    const liveDropIds = liveDrops.map((drop) => drop.itemId);
    const previousDrops = await this.itemService.selectItemsLiveDropsData(liveDropIds);

    this.server.emit('connected', previousDrops);
  }

  @SubscribeMessage('itemDropped')
  async handleItemDrop(@MessageBody() data: ItemDroppedDto): Promise<void> {
    const latestDrop = await this.itemService.selectItemLiveDropData(data.itemId);
    await this.liveDropsService.saveDropData(data.itemId, data.lootboxId);

    this.server.emit('itemDropped', latestDrop);
  }
}
