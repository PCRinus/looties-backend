import { NotFoundException } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { PrismaClient } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';
import { SharedModule } from '@shared/shared.module';
import { type DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { ChatService, MAX_MESSAGE_COUNT } from './chat.service';

describe('ChatService', () => {
  let chatService: ChatService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [ChatService],
    })
      .overrideProvider(PrismaService)
      .useValue(
        mockDeep<PrismaClient>() as unknown as DeepMockProxy<{
          [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
        }>,
      )
      .compile();

    chatService = module.get<ChatService>(ChatService);
    prisma = module.get(PrismaService);
  });

  const message = {
    id: 'messageId',
    message: 'Hello world!',
    likedBy: [],
    userId: 'userId',
    createdAt: new Date(),
    updatedAt: new Date(),
    repliedTo: null,
  };

  describe('getMessageById', () => {
    it('should throw if the message is not found', async () => {
      prisma.message.findUnique.mockResolvedValue(null);

      await expect(chatService.getMessageById(message.id)).rejects.toThrowError(NotFoundException);
    });

    it('should return the message if found', async () => {
      prisma.message.findUnique.mockResolvedValue(message);

      expect(await chatService.getMessageById(message.id)).toEqual(message);
    });
  });

  describe('getMessages', () => {
    it('should return an empty array if no messages are found', async () => {
      prisma.message.findMany.mockResolvedValue([]);

      expect(await chatService.getMessages()).toEqual([]);
    });

    it('should return the messages if found', async () => {
      prisma.message.findMany.mockResolvedValue([message]);

      expect(await chatService.getMessages()).toEqual([message]);
    });
  });

  describe('saveMessage', () => {
    it('should save the message', async () => {
      prisma.message.create.mockResolvedValue(message);

      expect(await chatService.saveMessage(message.id, message.message)).toEqual(message);
    });
  });

  describe('deleteOldMessages', () => {
    it('should not delete the old messages if the message count is below the limit', async () => {
      prisma.message.count.mockResolvedValue(1);
      const result = await chatService.deleteOldMessages();

      expect(result).toBe('No messages to delete.');
    });

    it('should delete the old messages if the message count is above the limit', async () => {
      prisma.message.count.mockResolvedValue(MAX_MESSAGE_COUNT + 1);
      prisma.message.findMany.mockResolvedValue([message]);
      prisma.message.deleteMany.mockResolvedValue({ count: 1 });
      const result = await chatService.deleteOldMessages();

      expect(result).toBe(`Deleted ${1} messages.`);
    });
  });
});
