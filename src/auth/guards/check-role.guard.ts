import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  REQUEST_USER_KEY,
  ROLE_HIERARCHY,
  ROLE_TYPE_KEY,
} from '../constants/auth.constants';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/enums/user-role.enum';

/**
 * Guard to check if the user has the required role to access a route.
 * It uses the Reflector to get the allowed roles from the route metadata.
 * The user's role is compared against the allowed roles based on a predefined hierarchy.
 */
@Injectable()
export class CheckRoleGuard implements CanActivate {
  /**
   * Initializes the CheckRoleGuard with the Reflector service.
   * @param reflector - The Reflector service to access route metadata.
   */
  constructor(private readonly reflector: Reflector) {}

  /**
   * Checks if the user has the required role to access the route.
   * @param context - The execution context containing the request and user information.
   * @returns {boolean | Promise<boolean> | Observable<boolean>} - Returns true if the user has the required role, false otherwise.
   */
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
