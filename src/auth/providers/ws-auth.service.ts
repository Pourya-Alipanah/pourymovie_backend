import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import * as cookie from 'cookie';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REQUEST_USER_KEY,
} from 'src/auth/constants/auth.constants';

/**
 * WsAuthService is responsible for validating WebSocket clients
 * by checking their authentication tokens in cookies.
 * It uses the JwtService to verify the token and extracts user information.
 */
@Injectable()
export class WsAuthService {

  /**
   * Constructs the WsAuthService with the necessary dependencies.
   * @param jwtService - The JwtService to handle JWT operations.
   * @param jwtConfiguration - Configuration for JWT, including secret and options.
   */
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Validates the WebSocket client by checking the authentication token in cookies.
   * If the token is valid, it extracts the user information and attaches it to the client.
   * @param client - The WebSocket client connection.
   * @returns The user payload if validation is successful, otherwise null.
   */
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
