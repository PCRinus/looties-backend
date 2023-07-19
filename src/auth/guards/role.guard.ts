import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { Role } from '@@auth/decorators/roles.decorator';
import type { JwtPayload } from '@@auth/guards/auth.guard';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<Role>('role', context.getHandler());

    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<Request & { user: JwtPayload }>();

    return user.role === requiredRole;
  }
}
