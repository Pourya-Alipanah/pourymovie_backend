import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

/**
 * ActiveUserData interface representing the structure of the active user data
 * @interface ActiveUserData
 * @property {string} id - The unique identifier of the user
 * @property {string} email - The email address of the user
 * @property {string} username - The username of the user
 */
export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData = request[REQUEST_USER_KEY];

    // If a user passes a field to the decorator use only that field
    return field ? user?.[field] : user;
  },
);
