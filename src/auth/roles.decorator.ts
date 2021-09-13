import { UserRole } from '../user/entities/user.entity';
import { SetMetadata } from '@nestjs/common';

export type allowedRoles = keyof typeof UserRole | 'Any';

export const Roles = (roles: allowedRoles[]) => SetMetadata('roles', roles);
