import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { SharedModule } from '@@shared/shared.module';
import { UserSettingsController } from '@@user-settings/user-settings.controller';
import { UserSettingsService } from '@@user-settings/user-settings.service';

describe('UserSettingsController', () => {
  let controller: UserSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [UserSettingsController],
      providers: [UserSettingsService],
    }).compile();

    controller = module.get<UserSettingsController>(UserSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
