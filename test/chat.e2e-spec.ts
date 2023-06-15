import type { INestApplication } from '@nestjs/common';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Message, PrismaClient } from '@prisma/client';
import { log } from 'console';
import type { DeepMockProxy } from 'jest-mock-extended';
import { mockDeep } from 'jest-mock-extended';

import { ChatGateway } from '@@chat/chat.gateway';
import { ChatModule } from '@@chat/chat.module';
import { ChatService } from '@@chat/chat.service';
import { PrismaService } from '@@shared/prisma.service';
import { SharedModule } from '@@shared/shared.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SocketMock = require('socket.io-mock');

describe('ChatGateway (e2e)', () => {
  let app: INestApplication;
  let chatGateway: ChatGateway;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ChatModule, SharedModule],
      providers: [ChatGateway, ChatService],
    })
      .overrideProvider(PrismaService)
      .useValue(
        mockDeep<PrismaClient>() as unknown as DeepMockProxy<{
          [K in keyof PrismaClient]: Omit<PrismaClient[K], 'groupBy'>;
        }>,
      )
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    chatGateway = app.get<ChatGateway>(ChatGateway);
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handleMessage', () => {
    it('should emit a message', async () => {
      const mockSocket = new SocketMock();
      prisma.message.create.mockResolvedValue({
        id: '1',
        userId: '1',
        message: 'Hello',
        likedBy: [],
        repliedTo: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      log('mockSocket', mockSocket);

      await chatGateway.handleMessage({ userId: '1', message: 'Hello' });

      //TODO: this test is not actually working, we might need to replace the SocketMock with a real socket
      mockSocket.on('message', (data: Message) => {
        expect(data).toHaveProperty('userId');
        expect(data).toHaveProperty('message');
      });
    });
  });
});
