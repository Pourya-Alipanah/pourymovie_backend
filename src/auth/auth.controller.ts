import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

/**
 * Controller for handling authentication-related operations
 * @class AuthController
 * @version 1
 * @description This controller is responsible for handling authentication operations such as sign-in, sign-up, and token management.
 */
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  /**
   * AuthController
   * @description This controller is responsible for handling authentication-related operations.
   * It provides endpoints for signing in and managing tokens.
   * @param {AuthService} authService - Service for handling authentication logic
   * @returns {AuthController} - Returns an instance of AuthController
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint for user sign-in
   * @param {SignInDto} signInDto - Data transfer object containing user email and password
   * @returns {Promise<object>} - Returns a promise that resolves to an object containing access and refresh tokens
   */
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
