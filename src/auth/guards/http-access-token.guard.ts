import { Injectable, ExecutionContext } from '@nestjs/common';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REQUEST_USER_KEY,
} from 'src/auth/constants/auth.constants';
import { JwtAuthGuardBase } from './jwt-auth-base.guard';
import { Request } from 'express';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

@Injectable()
export class HttpAccessTokenGuard extends JwtAuthGuardBase {
  protected extractToken(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    return request.cookies?.[ACCESS_TOKEN_COOKIE_NAME];
  }

  protected attachUserToContext(
    context: ExecutionContext,
    payload: ActiveUserData,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    request[REQUEST_USER_KEY] = payload;
  }
}
