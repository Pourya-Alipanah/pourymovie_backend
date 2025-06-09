import { Inject, Injectable, Scope } from '@nestjs/common';
import { Response } from 'express';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { REFRESH_TOKEN_COOKIE_NAME } from '../constants/auth.constants';

/**
 * Provider for setting cookies in HTTP responses.
 * Designed to be used per HTTP request.
 * @class SetCookieProvider
 * @version 1
 */
@Injectable({ scope: Scope.REQUEST })
export class SetCookieProvider {
  /**
   * Injects the JWT configuration and the current HTTP request object.
   * @param jwtConfiguration The JWT configuration containing token settings.
   */
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}
  
  /**
   * Sets the access token as a cookie in the HTTP response.
   * @param accessToken The access token to be set as a cookie.
   * @param res The HTTP response object.
   */
  public setRefreshToken(refreshToken: string, res: Response) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: false /* process.env.NODE_ENV === 'production' */,
      sameSite: 'strict',
      path: '/api/v1/auth/refresh-tokens',
      maxAge: this.jwtConfiguration.refreshTokenTtl * 1000, // Convert seconds to milliseconds
    });
  }
}
