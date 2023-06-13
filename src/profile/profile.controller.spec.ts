import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { ProfileController } from '@@profile/profile.controller';
import { ProfileService } from '@@profile/profile.service';
import { SharedModule } from '@@shared/shared.module';

describe('ProfileController', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [ProfileController],
      providers: [ProfileService],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
