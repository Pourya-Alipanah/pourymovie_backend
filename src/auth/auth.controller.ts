import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './providers/auth.service';
import { SignInDto } from './dtos/sign-in.dto';
import { UsersService } from 'src/user/providers/users.service';
import { CreateUserDto } from 'src/user/dtos/request/create-user.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { Request, Response } from 'express';
import { SetCookieProvider } from './providers/set-cookie.provider';
import { REFRESH_TOKEN_COOKIE_NAME } from './constants/auth.constants';

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
   * @constructor
   * @param {AuthService} authService - Service for handling authentication logic
   * @param {UsersService} usersService - Service for handling user-related logic
   * @param {SetCookieProvider} setCookieProvider - Provider for setting cookies in HTTP responses
   * @description Initializes the AuthController with necessary services.
   * @returns {AuthController} - Returns an instance of AuthController
   */
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly setCookieProvider: SetCookieProvider,
  ) {}

  /**
   * Endpoint for user sign-in
   * @param {SignInDto} signInDto - Data transfer object containing user email and password
   * @returns {Promise<object>} - Returns a promise that resolves to an object containing access and refresh tokens
   */
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sign-in')
  public async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: SignInDto,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.signIn(signInDto);

    this.setCookieProvider.setRefreshToken(refreshToken, res);
    this.setCookieProvider.setAccessToken(accessToken, res);
  }

  /**
   * Endpoint for user sign-up
   * @param {CreateUserDto} createUserDto - Data transfer object containing user details for registration
   * @returns {Promise<object>} - Returns a promise that resolves to the created user object
   * @description This endpoint allows users to register by providing their details.
   */
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  public async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ) {
    const { accessToken, refreshToken } =
      await this.usersService.createUser(createUserDto);

    this.setCookieProvider.setRefreshToken(refreshToken, res);
    this.setCookieProvider.setAccessToken(accessToken, res);
  }

  /**
   * Endpoint for refresh tokens
   * @returns {Promise<object>} - Returns a promise that resolves to an object containing new access and refresh tokens
   * @description This endpoint allows users to refresh their access tokens using a valid refresh token.
   */
  @HttpCode(HttpStatus.NO_CONTENT)
  @Auth(AuthType.None)
  @Get('refresh-tokens')
  public async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

    const { accessToken, refreshToken: refreshTokenResponse } =
      await this.authService.refreshTokens({ refreshToken });

    this.setCookieProvider.setRefreshToken(refreshTokenResponse, res);
    this.setCookieProvider.setAccessToken(accessToken, res);
  }
}
