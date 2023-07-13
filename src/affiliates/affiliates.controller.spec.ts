import { createMock } from '@golevelup/ts-jest';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { AffiliatesController } from '@@affiliates/affiliates.controller';
import { AffiliatesService } from '@@affiliates/affiliates.service';
import { AuthGuard } from '@@auth/guards/auth.guard';
import { UserService } from '@@user/user.service';

describe('AffiliatesController', () => {
  let controller: AffiliatesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliatesController],
      providers: [
        { provide: UserService, useValue: createMock() },
        { provide: AffiliatesService, useValue: createMock() },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(createMock())
      .compile();

    controller = module.get<AffiliatesController>(AffiliatesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
