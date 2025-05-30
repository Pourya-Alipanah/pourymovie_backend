import { Injectable } from '@nestjs/common';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenGeneratorProvider } from './refresh-token-generator.provider';
import { SignInDto } from '../dtos/sign-in.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';

/**
 * @class AuthService
 * Service for handling authentication operations.
 * @description This service provides methods for user sign-in and token refresh operations.
 * @version 1
 */
@Injectable()
export class AuthService {
  /**
   * @constructor constructor for AuthService
   * @param {SignInProvider} signInProvider - Provider for handling user sign-in logic.
   * @param {RefreshTokenGeneratorProvider} refreshTokenGeneratorProvider - Provider for generating and refreshing tokens.
   * @description Initializes the AuthService with necessary dependencies.
   */
  constructor(
    // inject sign-in provider
    private readonly signInProvider: SignInProvider,
    // inject refresh token generator provider
    private readonly refreshTokenGeneratorProvider: RefreshTokenGeneratorProvider,
  ) {}

  /**
   * Method to sign in a user.
   * @param {SignInDto} signInDto - Data transfer object containing user email and password.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} - Returns a promise that resolves to an object containing access and refresh tokens.
   */
  public async signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }

  /**
   * Method to refresh tokens.
   * @param {RefreshTokenDto} refreshTokenDto - Data transfer object containing the refresh token.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} - Returns a promise that resolves to an object containing access and refresh tokens.
   */
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenGeneratorProvider.refreshTokens(
      refreshTokenDto,
    );
  }
}
