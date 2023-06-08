import { ChatService } from '@chat/chat.service';
import { ReplyMessageDto } from '@chat/dtos/reply-message.dto';
import { SendMessageDto } from '@chat/dtos/send-message.dto';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { LikeMessageDto } from './dtos/like-message.dto';
import { UnlikeMessageDto } from './dtos/unlike-message.to';

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

    await this.chatService.likeMessage(data.messageId, data.userId);
    this.server.emit('like', data.messageId);
  }

  @SubscribeMessage('unlike')
  async handleRemoveLike(@MessageBody() data: UnlikeMessageDto): Promise<void> {
    this.logger.log(`User ${data.userId} unliked ${data.messageId}`);

    await this.chatService.removeLikeFromMessage(data.messageId, data.userId);
    this.server.emit('unlike', data.messageId);
  }

  @SubscribeMessage('reply')
  async handleReply(@MessageBody() data: ReplyMessageDto): Promise<void> {
    const { userId, reply, originalMessageId } = data;

    const originalMessage = await this.chatService.getMessageById(originalMessageId);

    this.logger.log(`User ${userId} replied to ${originalMessageId} with ${reply}`);

    await this.chatService.saveMessage(userId, reply, originalMessageId);

    this.server.emit('reply', {
      reply,
      originalMessage,
    });
  }
}
