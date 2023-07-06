import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import type { OnGatewayConnection } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { WsGuard } from '@@auth/guards/ws.guard';
import { ItemDroppedDto } from '@@live-drops/dtos/item-dropped.dto';
import { LiveDropsService } from '@@live-drops/live-drops.service';
import { UserSettingsService } from '@@user-settings/user-settings.service';

@UsePipes(new ValidationPipe())
@UseGuards(WsGuard)
@WebSocketGateway({
  namespace: 'live-drops',
  //TODO: add trusted origins
  cors: {
    origin: '*',
  },
})
export class LiveDropsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  constructor(
    private readonly liveDropsService: LiveDropsService,
    private readonly userSettingsService: UserSettingsService,
  ) {}

  /**
   * @see @@auth/guards/ws.guard
   * @see https://stackoverflow.com/questions/58670553/nestjs-gateway-websocket-how-to-send-jwt-access-token-through-socket-emit
   */
  async handleConnection() {
    // const liveDrops = await this.liveDropsService.getDrops();
    // const liveDropIds = liveDrops.map((drop) => drop.itemId);
    // const previousDrops = await this.itemService.selectItemsLiveDropsData(liveDropIds);

    //TODO: redo this functionality once lootboxes and nfts are implemented
    this.server.emit('connected', []);
  }

  @SubscribeMessage('itemDropped')
  async handleItemDrop(@MessageBody() data: ItemDroppedDto): Promise<void> {
    // const latestDrop = await this.itemService.selectItemLiveDropData(data.itemId);
    // await this.liveDropsService.saveDropData(data.itemId, data.lootboxId);

    const isAnonymous = await this.userSettingsService.isAnonymousEnabled(data.userId);

    if (!isAnonymous) {
      this.server.emit('itemDropped', 'TODO');
    }
  }
}
