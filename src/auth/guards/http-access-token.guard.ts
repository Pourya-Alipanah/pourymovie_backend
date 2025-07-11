import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REQUEST_USER_KEY,
} from 'src/auth/constants/auth.constants';
import { JwtAuthGuardBase } from './jwt-auth-base.guard';
import { Request } from 'express';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * Guard for handling HTTP access tokens
 * @class HttpAccessTokenGuard
 * @extends JwtAuthGuardBase
 * @version 1
 * @description This guard extracts the access token from cookies and attaches the user data to the request context.
 */
@Injectable()
export class HttpAccessTokenGuard extends JwtAuthGuardBase {
  /**
   * Extracts the access token from the request cookies.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {string | undefined} - The access token if present, otherwise undefined.
   */
  protected extractToken(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    return request.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
  }

  /**
   * Attaches the user data to the request context.
   * @param {ExecutionContext} context - The execution context of the request.
   * @param {ActiveUserData} payload - The user data to attach.
   */
  protected attachUserToContext(
    context: ExecutionContext,
    payload: ActiveUserData,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    request[REQUEST_USER_KEY] = payload;
  }
}
