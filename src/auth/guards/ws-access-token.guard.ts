import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtAuthGuardBase } from './jwt-auth-base.guard';
import * as cookie from 'cookie';
import {
  REQUEST_USER_KEY,
  ACCESS_TOKEN_COOKIE_NAME,
} from 'src/auth/constants/auth.constants';

@Injectable()
export class WsAccessTokenGuard extends JwtAuthGuardBase {
  protected extractToken(context: ExecutionContext): string | undefined {
    const client = context.switchToWs().getClient();
    const handshake = client.handshake;

    if (!handshake?.headers?.cookie) return undefined;

    const cookies = cookie.parse(handshake?.headers?.cookie);
    return cookies[ACCESS_TOKEN_COOKIE_NAME];
  }

  protected attachUserToContext(context: ExecutionContext, payload: any) {
    const client = context.switchToWs().getClient();
    client[REQUEST_USER_KEY] = payload;
  }
}
