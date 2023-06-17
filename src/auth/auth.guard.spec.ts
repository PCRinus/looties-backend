import { JwtService } from '@nestjs/jwt';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  const jwtService = new JwtService();
  it('should be defined', () => {
    expect(new AuthGuard(jwtService)).toBeDefined();
  });
});
