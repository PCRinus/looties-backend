import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { AffiliatesService } from '@@affiliates/affiliates.service';
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
      providers: [AuthService, JwtService, ConfigService, UserService, AffiliatesService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
