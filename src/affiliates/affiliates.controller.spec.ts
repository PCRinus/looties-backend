import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { AffiliatesController } from '@@affiliates/affiliates.controller';
import { AffiliatesService } from '@@affiliates/affiliates.service';
import { SharedModule } from '@@shared/shared.module';
import { UserModule } from '@@user/user.module';
import { UserService } from '@@user/user.service';

describe('AffiliatesController', () => {
  let controller: AffiliatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UserModule, SharedModule],
      controllers: [AffiliatesController],
      providers: [UserService, AffiliatesService],
    }).compile();

    controller = module.get<AffiliatesController>(AffiliatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
