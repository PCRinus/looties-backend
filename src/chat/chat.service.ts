import { Injectable } from '@nestjs/common';
import { PrismaService } from '@shared/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prismaService: PrismaService) {}

  async saveMessage({ message, userId }): Promise<void> {
    await this.prismaService.message.create({
      data: {
        message,
        userId,
      },
    });
  }
}
