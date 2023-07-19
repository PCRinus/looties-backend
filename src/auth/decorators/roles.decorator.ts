import { SetMetadata } from '@nestjs/common';

export const ROLES = {
  PLAYER: 'PLAYER',
  ADMIN: 'ADMIN',
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_KEY = 'role';
export const Role = (role: Role) => SetMetadata(ROLE_KEY, role);
