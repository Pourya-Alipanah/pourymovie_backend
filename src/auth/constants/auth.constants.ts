import { UserRole } from 'src/user/enums/user-role.enum';

/**
 * key for get active user from request
 */
export const REQUEST_USER_KEY = 'user';

/**
 * key of meta data for auth decorator
 */
export const AUTH_TYPE_KEY = 'authType';

/**
 * key of meta data for role decorator
 */
export const ROLE_TYPE_KEY = 'roleType';

/**
 * Name of the cookie used to store the refresh token.
 */
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

/**
 * Name of the cookie used to store the access token.
 */
export const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';

/**
 * The hierarchy of user roles in the application.
 * This array defines the order of roles from lowest to highest privilege.
 */
export const ROLE_HIERARCHY = [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN];
