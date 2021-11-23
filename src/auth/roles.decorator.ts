import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@user/entities/user.entity';

export type allowedRoles = keyof typeof UserRole | 'Any';

export const Roles = (roles: allowedRoles[]) => SetMetadata('roles', roles);
