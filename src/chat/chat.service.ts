import { Injectable } from '@nestjs/common';
import type { Message } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';
@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMessageById(messageId: string): Promise<Message> {
    return await this.prismaService.message.findUnique({
      where: {
        id: messageId,
      },
    });
  }

  async getMessages(): Promise<Message[]> {
    return await this.prismaService.message.findMany({
      take: 20,
    });
  }

  async saveMessage(userId: string, message: string, originalMessageId: string = undefined): Promise<void> {
    await this.prismaService.message.create({
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
    const { likedBy: existingLikedBy } = await this.prismaService.message.findFirst({
      where: {
        id: messageId,
      },
      select: {
        likedBy: true,
      },
    });

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
}
