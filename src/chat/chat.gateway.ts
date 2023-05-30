import { SubscribeMessage, WebSocketGateway, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from '@chat/chat.service';

interface SendMessage {
  userId: string;
  message: string;
}

@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  private readonly server: Server;

  @SubscribeMessage('send')
  async handleMessage(@MessageBody() data: SendMessage): Promise<void> {
    console.log(data);

    await this.chatService.saveMessage(data);
    this.server.emit('send', data.message);
  }

  @SubscribeMessage('like')
  handleLike(): void {
    this.server.emit('like', 'This is the server response for likes');
  }

  @SubscribeMessage('reply')
  handleReply(): void {}
}
