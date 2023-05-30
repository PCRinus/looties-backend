import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '@chat/chat.service';
import { Logger } from '@nestjs/common';

interface SendMessage {
  userId: string;
  message: string;
}

interface LikeMessage {
  userId: string;
  messageId: string;
}

interface ReplyToMessage {
  userId: string;
  messageId: string;
  reply: string;
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  async handleConnection(client: Socket) {
    this.logger.log(`User connected: ${client.id}`);

    const messages = await this.chatService.getMessages();
    this.server.emit('connected', messages);
  }

  @SubscribeMessage('send')
  async handleMessage(@MessageBody() data: SendMessage): Promise<void> {
    const { userId, message } = data;

    this.logger.log(`Received message from ${userId}: ${message}`);

    await this.chatService.saveMessage(userId, message);
    this.server.emit('send', data.message);
  }

  @SubscribeMessage('like')
  async handleLike(@MessageBody() data: LikeMessage): Promise<void> {
    this.logger.log(`User ${data.userId} liked ${data.messageId}`);

    await this.chatService.likeMessage(data.messageId);
    this.server.emit('like', data.messageId);
  }

  @SubscribeMessage('removeLike')
  async handleRemoveLike(@MessageBody() data: LikeMessage): Promise<void> {
    this.logger.log(`User ${data.userId} unliked ${data.messageId}`);

    await this.chatService.removeLikeMessage(data.messageId);
    this.server.emit('removeLike', data.messageId);
  }

  @SubscribeMessage('reply')
  async handleReply(@MessageBody() data: ReplyToMessage): Promise<void> {
    const { userId, messageId, reply } = data;

    this.logger.log(`User ${userId} replied to ${messageId} with ${reply}`);

    await this.chatService.saveMessage(userId, reply);
    this.server.emit('reply', reply);
  }
}
