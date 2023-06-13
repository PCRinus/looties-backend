import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { SharedModule } from '@@shared/shared.module';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

describe('ChatGateway', () => {
  let chatGateway: ChatGateway;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [ChatGateway, ChatService],
    }).compile();

    chatGateway = module.get<ChatGateway>(ChatGateway);
    chatService = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(chatGateway).toBeDefined();
  });

  it('should be defined too', () => {
    expect(chatService).toBeDefined();
  });
});
