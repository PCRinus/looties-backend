import { createMock } from '@golevelup/ts-jest';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { FileStorageService } from '@@file-storage/file-storage.service';
import { ProfileService } from '@@profile/profile.service';
import { SharedModule } from '@@shared/shared.module';
import { UserSettingsService } from '@@user-settings/user-settings.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        ProfileService,
        { provide: UserSettingsService, useValue: createMock() },
        { provide: FileStorageService, useValue: createMock() },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
