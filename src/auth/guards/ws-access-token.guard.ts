import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuardBase } from './jwt-auth-base.guard';
import * as cookie from 'cookie';
import {
  REQUEST_USER_KEY,
  ACCESS_TOKEN_COOKIE_NAME,
} from 'src/auth/constants/auth.constants';

/**
 * Guard for handling WebSocket access tokens
 * @class WsAccessTokenGuard
 * @extends JwtAuthGuardBase
 * @version 1
 * @description This guard extracts the access token from cookies in WebSocket handshake and attaches the user data to the client context.
 */
@Injectable()
export class WsAccessTokenGuard extends JwtAuthGuardBase {
  /**
   * Extracts the access token from the WebSocket handshake cookies.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {string | undefined} - The access token if present, otherwise undefined.
   */
  protected extractToken(context: ExecutionContext): string | undefined {
    const client = context.switchToWs().getClient();
    const handshake = client.handshake;

    if (!handshake?.headers?.cookie) return undefined;

    const cookies = cookie.parse(handshake?.headers?.cookie);
    return cookies[ACCESS_TOKEN_COOKIE_NAME];
  }

  /**
   * Attaches the user data to the WebSocket client context.
   * @param {ExecutionContext} context - The execution context of the request.
   * @param {any} payload - The user data to attach.
   */
  protected attachUserToContext(context: ExecutionContext, payload: any) {
    const client = context.switchToWs().getClient();
    client[REQUEST_USER_KEY] = payload;
  }
}
