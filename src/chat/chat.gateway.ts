import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import type { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type { Socket } from 'socket.io';
import { Server } from 'socket.io';

import { WsGuard } from '@@auth/guards/ws.guard';
import { ChatService } from '@@chat/chat.service';
import { ReplyMessageDto } from '@@chat/dtos/reply-message.dto';
import { SendMessageDto } from '@@chat/dtos/send-message.dto';
import { ProfileService } from '@@profile/profile.service';
import { UserSettingsService } from '@@user-settings/user-settings.service';

import { LikeMessageDto } from './dtos/like-message.dto';
import { UnlikeMessageDto } from './dtos/unlike-message.to';

@UsePipes(new ValidationPipe())
@UseGuards(WsGuard)
@WebSocketGateway({
  namespace: 'chat',
  //TODO: add trusted origins
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private readonly server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  private connectedUsersCount = 0;

  constructor(
    private readonly chatService: ChatService,
    private readonly userSettingsService: UserSettingsService,
    private readonly profileService: ProfileService,
  ) {}

  /**
   * @see @@auth/guards/ws.guard
   * @see https://stackoverflow.com/questions/58670553/nestjs-gateway-websocket-how-to-send-jwt-access-token-through-socket-emit
   */
  async handleConnection(client: Socket) {
    this.logger.log(`User connected: ${client.id}`);

    let messages = await this.chatService.getMessages();
    messages = await Promise.all(
      messages.map(async (message) => {
        const { userName, level } = await this.profileService.getProfileCore(message.userId);
        const isAnonymous = await this.userSettingsService.isAnonymousEnabled(message.userId);
        const name = isAnonymous ? 'Anonymous' : userName;
        return { ...message, name, level };
      }),
    );

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

    const newMessage = await this.chatService.saveMessage(userId, message);
    const { userName, level } = await this.profileService.getProfileCore(userId);
    const isAnonymous = await this.userSettingsService.isAnonymousEnabled(userId);

    const name = isAnonymous ? 'Anonymous' : userName;

    this.server.emit('message', { newMessage, name, level });
  }

  @SubscribeMessage('like')
  async handleLike(@MessageBody() data: LikeMessageDto): Promise<void> {
    const { userId, messageId } = data;
    this.logger.log(`User ${userId} liked ${messageId}`);

    await this.chatService.likeMessage(messageId, userId);
    this.server.emit('like', { likedMessageId: messageId, likedByUserId: userId });
  }

  @SubscribeMessage('unlike')
  async handleRemoveLike(@MessageBody() data: UnlikeMessageDto): Promise<void> {
    const { userId, messageId } = data;
    this.logger.log(`User ${userId} unliked ${messageId}`);

    await this.chatService.removeLikeFromMessage(messageId, userId);
    this.server.emit('unlike', { unlikedMessageId: messageId, unlikedByUserId: userId });
  }

  @SubscribeMessage('reply')
  async handleReply(@MessageBody() data: ReplyMessageDto): Promise<void> {
    const { userId, reply, originalMessageId } = data;

    const originalMessage = await this.chatService.getMessageById(originalMessageId);

    this.logger.log(`User ${userId} replied to ${originalMessageId} with ${reply}`);

    const newMessage = await this.chatService.saveMessage(userId, reply, originalMessageId);
    const { userName, level } = await this.profileService.getProfileCore(userId);
    const isAnonymous = await this.userSettingsService.isAnonymousEnabled(userId);

    const name = isAnonymous ? 'Anonymous' : userName;

    this.server.emit('reply', {
      newMessage,
      originalMessage,
      name,
      level,
    });
  }
}
