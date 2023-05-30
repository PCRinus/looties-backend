import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '@chat/chat.service';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { SendMessageDto } from '@chat/dtos/send-message.dto';
import { LikeMessageDto } from './dtos/like-message.dto';
import { UnlikeMessageDto } from './dtos/unlike-message.to';

interface ReplyToMessage {
  userId: string;
  messageId: string;
  reply: string;
}

@UsePipes(new ValidationPipe())
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
