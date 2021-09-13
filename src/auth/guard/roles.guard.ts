import { User } from '../../user/entities/user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(roles);
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) return false;

    return roles.includes(user.role) || roles.includes('Any');
  }
}
