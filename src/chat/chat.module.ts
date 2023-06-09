import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
