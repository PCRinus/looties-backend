import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import type { Message } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

const MAX_MESSAGE_COUNT = 5000;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async getMessageById(messageId: string): Promise<Message> {
    const message = await this.prismaService.message.findUnique({
      where: {
        id: messageId,
      },
    });

    if (!message) {
      throw new NotFoundException(`Message with id ${messageId} not found`);
    }

    return message;
  }

  async getMessages(): Promise<Message[]> {
    return await this.prismaService.message.findMany({
      take: 20,
    });
  }

  async saveMessage(userId: string, message: string, originalMessageId?: string): Promise<Message> {
    return await this.prismaService.message.create({
      data: {
        message,
        userId,
        repliedTo: originalMessageId,
      },
    });
  }

  async likeMessage(messageId: string, userId: string): Promise<void> {
    await this.prismaService.message.update({
      where: {
        id: messageId,
      },
      data: {
        likedBy: {
          push: userId,
        },
      },
    });
  }

  async removeLikeFromMessage(messageId: string, userId: string): Promise<void> {
    const likedBy = await this.prismaService.message.findFirst({
      where: {
        id: messageId,
      },
      select: {
        likedBy: true,
      },
    });
    const existingLikedBy = likedBy?.likedBy ?? [];
    const filteredLikedBy = existingLikedBy.filter((id) => id !== userId);

    await this.prismaService.message.update({
      where: {
        id: messageId,
      },
      data: {
        likedBy: {
          set: filteredLikedBy,
        },
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteOldMessages(): Promise<string> {
    this.logger.log('Deleting old messages...');

    const currentMessageCount = await this.prismaService.message.count();

    if (currentMessageCount < MAX_MESSAGE_COUNT) {
      this.logger.log('No messages to delete.');
      return 'No messages to delete.';
    }

    const messageCountToDelete = currentMessageCount - MAX_MESSAGE_COUNT;
    const messageIdsToDelete = (
      await this.prismaService.message.findMany({
        select: {
          id: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: messageCountToDelete,
      })
    ).map(({ id }) => id);

    await this.prismaService.message.deleteMany({
      where: {
        id: {
          in: messageIdsToDelete,
        },
      },
    });

    return `Deleted ${messageCountToDelete} messages.`;
  }
}
