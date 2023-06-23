import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const jwtService = new JwtService();
  const configService = new ConfigService();
  const reflector = new Reflector();
  it('should be defined', () => {
    expect(new AuthGuard(jwtService, configService, reflector)).toBeDefined();
  });
});
