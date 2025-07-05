import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Reflector } from '@nestjs/core';
import { HttpAccessTokenGuard } from './http-access-token.guard';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';
import { JwtAuthGuardBase } from './jwt-auth-base.guard';
import { WsAccessTokenGuard } from './ws-access-token.guard';

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
   * AuthenticationGuard
   * @description This guard is responsible for handling authentication based on the auth type specified in the route metadata.
   * It uses different guards for different authentication types.
   * @param {Reflector} reflector - Reflector service to access route metadata
   * @param {HttpAccessTokenGuard} httpAccessTokenGuard - Guard for handling HTTP access tokens
   * @param {WsAccessTokenGuard} wsAccessTokenGuard - Guard for handling WebSocket access tokens
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly httpAccessTokenGuard: HttpAccessTokenGuard,
    private readonly wsAccessTokenGuard: WsAccessTokenGuard,
  ) {}

  /**
   * Default authentication type to use if none is specified
   * @type {AuthType}
   */
  private static readonly defaultAuthType: AuthType = AuthType.Bearer;

  /**
   * CanActivate method to check if the request can be activated based on the auth type
   * @param {ExecutionContext} context - The execution context of the request
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the request can be activated, otherwise throws an UnauthorizedException
   * @throws {UnauthorizedException} - If the user is not authenticated or does not have the required permissions
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const contextType = context.getType();

    const authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]> = {
      [AuthType.Bearer]:
        contextType === 'http'
          ? this.httpAccessTokenGuard
          : this.wsAccessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];

    const guards = authTypes.map((type) => authTypeGuardMap[type]).flat();

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
