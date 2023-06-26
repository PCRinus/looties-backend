import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ProfileModule } from '@@profile/profile.module';
import { UserSettingsModule } from '@@user-settings/user-settings.module';

import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [ScheduleModule.forRoot(), UserSettingsModule, ProfileModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
