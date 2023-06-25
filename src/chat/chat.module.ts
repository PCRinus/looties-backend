import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { UserSettingsModule } from '@@user-settings/user-settings.module';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [ScheduleModule.forRoot(), UserSettingsModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
