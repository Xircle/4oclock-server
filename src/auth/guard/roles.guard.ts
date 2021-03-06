import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '@user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user) {
      console.log('role guard - no user');
      return false;
    }
    console.log('role guard ' + user.role);
    return (
      roles.includes(user.role) ||
      roles.includes('Any') ||
      user.role === 'Banned'
    );
  }
}
