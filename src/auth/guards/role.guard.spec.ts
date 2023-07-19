import { Reflector } from '@nestjs/core';

import { RoleGuard } from './role.guard';

describe('RoleGuard', () => {
  it('should be defined', () => {
    const reflector = new Reflector();

    expect(new RoleGuard(reflector)).toBeDefined();
  });
});
