import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { WsGuard } from './ws.guard';

describe('WsGuard', () => {
  const reflector = new Reflector();
  const configService = new ConfigService();
  const jwtService = new JwtService();
  it('should be defined', () => {
    expect(new WsGuard(reflector, configService, jwtService)).toBeDefined();
  });
});
