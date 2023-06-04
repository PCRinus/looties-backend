import { Injectable } from '@nestjs/common';
import type { Message } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';
@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMessages(): Promise<Message[]> {
    return await this.prismaService.message.findMany({
      take: 20,
    });
  }

  async saveMessage(userId: string, message: string): Promise<void> {
    await this.prismaService.message.create({
      data: {
        message,
        userId,
      },
    });
  }

  async likeMessage(messageId: string): Promise<void> {
    await this.prismaService.message.update({
      where: {
        id: messageId,
      },
      data: {
        likes: {
          increment: 1,
        },
      },
    });
  }

  async removeLikeFromMessage(messageId: string): Promise<void> {
    await this.prismaService.message.update({
      where: {
        id: messageId,
      },
      data: {
        likes: {
          decrement: 1,
        },
      },
    });
  }
}
