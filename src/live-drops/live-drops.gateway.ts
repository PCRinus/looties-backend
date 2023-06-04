import { ItemService } from '@item/item.service';
import { ItemDroppedDto } from '@live-drops/dtos/item-dropped.dto';
import { LiveDropsService } from '@live-drops/live-drops.service';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import type { OnGatewayConnection } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@UsePipes(new ValidationPipe())
@WebSocketGateway(3002)
export class LiveDropsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly liveDropsService: LiveDropsService, private readonly itemService: ItemService) {}

  async handleConnection() {
    const liveDrops = await this.liveDropsService.getDrops();
    this.server.emit('connected', liveDrops);
  }

  @SubscribeMessage('itemDropped')
  async handleItemDrop(@MessageBody() data: ItemDroppedDto): Promise<void> {
    const itemNameAndPrice = await this.itemService.selectItemNameAndPriceById(data.itemId);
    await this.liveDropsService.saveDropData(data.itemId);

    this.server.emit('itemDropped', itemNameAndPrice);
  }
}
