import { createMock } from '@golevelup/ts-jest';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { AuthController } from '@@auth/auth.controller';
import { AuthService } from '@@auth/auth.service';
import { SharedModule } from '@@shared/shared.module';
import { UserService } from '@@user/user.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: createMock() },
        { provide: UserService, useValue: createMock() },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
