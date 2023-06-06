import { ChatService } from '@chat/chat.service';
import { SendMessageDto } from '@chat/dtos/send-message.dto';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { LikeMessageDto } from './dtos/like-message.dto';
import { UnlikeMessageDto } from './dtos/unlike-message.to';

interface ReplyToMessage {
  userId: string;
  messageId: string;
  reply: string;
}

@UsePipes(new ValidationPipe())
@WebSocketGateway(3001, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  private connectedUsersCount = 0;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket) {
    this.logger.log(`User connected: ${client.id}`);

    const messages = await this.chatService.getMessages();
    this.connectedUsersCount++;

    this.server.emit('connected', { messages });
    this.server.emit('get-users-count', { connectedUsersCount: this.connectedUsersCount });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`User disconnected: ${client.id}`);

    this.connectedUsersCount--;

    this.server.emit('get-users-count', { connectedUsersCount: this.connectedUsersCount });
  }

  @SubscribeMessage('message')
  async handleMessage(@MessageBody() data: SendMessageDto): Promise<void> {
    const { userId, message } = data;

    this.logger.log(`Received message from ${userId}: ${message}`);

    await this.chatService.saveMessage(userId, message);
    this.server.emit('message', data.message);
  }

  @SubscribeMessage('like')
  async handleLike(@MessageBody() data: LikeMessageDto): Promise<void> {
    this.logger.log(`User ${data.userId} liked ${data.messageId}`);

    await this.chatService.likeMessage(data.messageId);
    this.server.emit('like', data.messageId);
  }

  @SubscribeMessage('unlike')
  async handleRemoveLike(@MessageBody() data: UnlikeMessageDto): Promise<void> {
    this.logger.log(`User ${data.userId} unliked ${data.messageId}`);

    await this.chatService.removeLikeFromMessage(data.messageId);
    this.server.emit('unlike', data.messageId);
  }

  @SubscribeMessage('reply')
  async handleReply(@MessageBody() data: ReplyToMessage): Promise<void> {
    const { userId, messageId, reply } = data;

    this.logger.log(`User ${userId} replied to ${messageId} with ${reply}`);

    await this.chatService.saveMessage(userId, reply);
    this.server.emit('reply', reply);
  }
}
