import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
import { AccessTokenGuard } from './access-token.guard';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';

/**
 * Guard for handling authentication based on different auth types
 * @class AuthenticationGuard
 * @version 1
 * @description This guard checks the authentication type required for accessing a route and applies the appropriate guard.
 * It supports multiple authentication types, such as Bearer tokens and no authentication.
 */
@Injectable()
export class AuthenticationGuard implements CanActivate {
  /**
   * Map of authentication types to their corresponding guards
   * @type {Record<AuthType, CanActivate | CanActivate[]>}
   */
  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  >;

  /**
   * AuthenticationGuard
   * @description This guard is responsible for handling authentication based on the auth type specified in the route metadata.
   * It uses different guards for different authentication types.
   * @param {Reflector} reflector - Reflector service to access route metadata
   * @param {AccessTokenGuard} accessTokenGuard - Guard for handling Bearer token authentication
   * @returns {AuthenticationGuard} - Returns an instance of AuthenticationGuard
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    // Create authTypeGuardMap
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }

  /**
   * Default authentication type to use if none is specified
   * @type {AuthType}
   */
  private static readonly defaultAuthType = AuthType.Bearer;

  /**
   * CanActivate method to check if the request can be activated based on the auth type
   * @param {ExecutionContext} context - The execution context of the request
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the request can be activated, otherwise throws an UnauthorizedException
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();

    // Declare the default error
    let error = new UnauthorizedException();

    for (const instance of guards) {
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
