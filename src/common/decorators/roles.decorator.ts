import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'ADMIN',
  SALES_REP = 'SALES_REP',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
