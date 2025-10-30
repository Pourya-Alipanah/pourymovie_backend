import { SetMetadata } from '@nestjs/common';
import { AuthType } from '../enums/auth-type.enum';
import { AUTH_TYPE_KEY } from '../constants/auth.constants';

/**
 * Decorator to specify the authentication type required for a route
 * @param {...AuthType[]} authTypes - The authentication types to apply to the route
 * @returns {MethodDecorator} - Returns a method decorator that sets the authentication type metadata
 */
export const Auth = (...authTypes: AuthType[]) =>
  SetMetadata(AUTH_TYPE_KEY, authTypes);
