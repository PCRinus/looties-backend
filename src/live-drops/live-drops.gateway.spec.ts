import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { LiveDropsService } from '@@live-drops/live-drops.service';
import { SharedModule } from '@@shared/shared.module';
import { UserSettingsService } from '@@user-settings/user-settings.service';

import { LiveDropsGateway } from './live-drops.gateway';

describe('LiveDropsGateway', () => {
  let gateway: LiveDropsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [LiveDropsGateway, LiveDropsService, ConfigService, JwtService, UserSettingsService],
    }).compile();

    gateway = module.get<LiveDropsGateway>(LiveDropsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
