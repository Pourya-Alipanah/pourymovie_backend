import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';
import { AccessTokenGuard } from './access-token.guard';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY, ROLE_TYPE_KEY } from '../constants/auth.constants';
import { CheckRoleGuard } from './check-role.guard';

/**
 * AuthorizationGuard
 * @description This guard is responsible for handling authorization based on the auth type specified in the route metadata.
 * It uses different guards for different authorization types.
 */
@Injectable()
export class AuthorizationGuard implements CanActivate {
  /**
   * Map of role types to their corresponding guards
   * @type {Record<AuthType, CanActivate | CanActivate[]>}
   */
  private readonly roleTypeGuardMap: Record<
    UserRole,
    CanActivate | CanActivate[]
  >;

  /**
   * Initializes the AuthorizationGuard with the necessary dependencies.
   * @param reflector - The Reflector service to access route metadata.
   * @param checkRoleGuard - The CheckRoleGuard to handle role-based access control.
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly checkRoleGuard: CheckRoleGuard,
  ) {
    this.roleTypeGuardMap = {
      [UserRole.ADMIN]: this.checkRoleGuard,
      [UserRole.SUPER_ADMIN]: this.checkRoleGuard,
      [UserRole.USER]: { canActivate: () => true },
    };
  }

  /**
   * Default authentication type to use if none is specified
   * @type {AuthType}
   */
  private static readonly defaultRoleType = UserRole.USER;

  /**
   * CanActivate method to check if the request can be activated based on the role type
   * @param {ExecutionContext} context - The execution context of the request
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the request can be activated, otherwise throws an UnauthorizedException
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roleTypes = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthorizationGuard.defaultRoleType];

    const guards = roleTypes.map((type) => this.roleTypeGuardMap[type]).flat();

    // Declare the default error
    let error = new UnauthorizedException();

    for (const instance of guards) {
      console.log(instance);
      // Decalre a new constant
      const canActivate = await Promise.resolve(
        // Here the AccessToken Guard Will be fired and check if user has permissions to acces
        // Later Multiple AuthTypes can be used even if one of them returns true
        // The user is Authorised to access the resource
        instance.canActivate(context),
      ).catch((err) => {
        error = err;
      });

      if (canActivate) {
        return true;
      }
    }
    throw error;
  }
}
