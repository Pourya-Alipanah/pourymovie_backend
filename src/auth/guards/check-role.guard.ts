import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { REQUEST_USER_KEY, ROLE_HIERARCHY, ROLE_TYPE_KEY } from '../constants/auth.constants';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/enums/user-role.enum';

@Injectable()
export class CheckRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    );
    const request = context.switchToHttp().getRequest();
    const user = request?.[REQUEST_USER_KEY];

    const userRoleIndex = ROLE_HIERARCHY.indexOf(user.role);

    return allowedRoles.some(
      (role) => userRoleIndex >= ROLE_HIERARCHY.indexOf(role),
    );
  }
}
