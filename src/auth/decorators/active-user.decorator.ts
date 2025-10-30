import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { REQUEST_USER_KEY } from '../constants/auth.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * ActiveUserData interface representing the structure of the active user data
 * This interface is used to define the properties of the user object
 * It is typically used in decorators to extract user information from the request context
 * @interface ActiveUserData
 * @property {string} id - The unique identifier of the user
 * @property {string} email - The email address of the user
 * @property {string} username - The username of the user
 */
export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    let user: ActiveUserData | undefined;

    if (ctx.getType() === 'http') {
      const request = ctx.switchToHttp().getRequest();
      user = request[REQUEST_USER_KEY];
    } else if (ctx.getType() === 'ws' || ctx.getType() === 'rpc') {
      const client = ctx.switchToWs().getClient();
      user = client[REQUEST_USER_KEY];
    }
    return field ? user?.[field] : user;
  },
);
