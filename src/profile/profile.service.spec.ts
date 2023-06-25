import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ProfileService } from '@@profile/profile.service';
import { SharedModule } from '@@shared/shared.module';
import { UserSettingsService } from '@@user-settings/user-settings.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [ProfileService, UserSettingsService],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
