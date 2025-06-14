import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/user/enums/user-role.enum';
import { ROLE_TYPE_KEY } from '../constants/auth.constants';

/**
 * Decorator to set the required user roles for a route.
 * This decorator uses metadata to specify which user roles are allowed to access the route.
 * @param roleTypes - The user roles that are allowed to access the route.
 * @returns A metadata decorator that sets the allowed user roles.
 */
export const Role = (...roleTypes: UserRole[]) =>
  SetMetadata(ROLE_TYPE_KEY, roleTypes);
