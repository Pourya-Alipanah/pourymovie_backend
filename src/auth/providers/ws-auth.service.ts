import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import * as cookie from 'cookie';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REQUEST_USER_KEY,
} from 'src/auth/constants/auth.constants';

@Injectable()
export class WsAuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async validateClient(client: any) {
    const cookies = client.handshake.headers.cookie;
    
    if (!cookies) return null;
    
    const parsed = cookie.parse(cookies);
    const token = parsed[ACCESS_TOKEN_COOKIE_NAME];
    if (!token) return null;
    
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      client[REQUEST_USER_KEY] = payload;
      return payload;
    } catch(err) {
      console.error(err);
      return null;
    }
  }
}
