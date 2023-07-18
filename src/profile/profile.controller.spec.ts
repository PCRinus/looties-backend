import { createMock } from '@golevelup/ts-jest';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ProfileController } from '@@profile/profile.controller';
import { ProfileService } from '@@profile/profile.service';
import { SharedModule } from '@@shared/shared.module';
import { UserSettingsService } from '@@user-settings/user-settings.service';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [ProfileController],
      providers: [{ provide: ProfileService, useValue: createMock() }, JwtService, ConfigService, UserSettingsService],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
