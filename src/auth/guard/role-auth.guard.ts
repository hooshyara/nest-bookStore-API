import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import userRoleEnum from 'src/user/enum/userRoleEnum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<userRoleEnum[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredRoles) return true;
    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new UnauthorizedException('کاربر احراز هویت نشده');

    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) throw new UnauthorizedException('شما دسترسی لازم را ندارید');

    console.log(user);
    return true;
  }
  handleReques(err: any, user: any) {
    if (err || !user) throw err || new UnauthorizedException('invalid token');
    return user;
  }
}
