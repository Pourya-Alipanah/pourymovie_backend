import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import jwtConfigs from '../config/jwt.config';
import { User } from 'src/user/user.entity';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * TokenGeneratorProvider is a service that generates JWT tokens for users.
 * It provides methods to create access and refresh tokens based on user information.
 * The tokens are signed with a secret key and can include additional payload data.
 * It uses the JwtService from @nestjs/jwt to handle the signing and verification of tokens.
 * The tokens can be configured with an audience, issuer, and expiration time.
 */
@Injectable()
export class TokenGeneratorProvider {
  /**
   * Constructor for TokenGeneratorProvider.
   * @param jwtService - The JwtService instance used for signing tokens.
   * @param jwtConfig - The configuration for JWT, including secret, audience, issuer, and token TTLs.
   * @throws {Error} If the JWT configuration is not provided or is invalid.
   */
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfigs.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfigs>,
  ) {}

  /**
   * Generates a JWT token for a user with a specified expiration time and optional payload.
   * @param userId - The ID of the user for whom the token is being generated.
   * @param expiresIn - The expiration time for the token in seconds.
   * @param payload - Optional additional data to include in the token payload.
   * @returns A promise that resolves to the generated JWT token as a string.
   */
  public async generateToken<T extends Record<string, any>>(
    userId: number,
    expiresIn: number,
    payload?: T,
  ): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfig.secret,
        audience: this.jwtConfig.audience,
        issuer: this.jwtConfig.issuer,
        expiresIn,
      },
    );
  }

  /**
   * Generates an access token for a user with a specified expiration time and email in the payload.
   * @param user - The user object for whom the access token is being generated.
   * @returns A promise that resolves to the generated access token as a string.
   * This token includes the user's email in the payload.
   * The access token is typically used for authenticating API requests.
   * */
  public async generateAccessToken(user: User): Promise<string> {
    return this.generateToken<Partial<ActiveUserData>>(
      user.id,
      this.jwtConfig.accessTokenTtl,
      {
        email: user.email,
        role: user.role,
      },
    );
  }

  /**
   * Generates a refresh token for a user with a specified expiration time.
   * @param user - The user object for whom the refresh token is being generated.
   * @return A promise that resolves to the generated refresh token as a string.
   * This token is used to obtain new access tokens without requiring the user to log in again.
   */
  public async generateRefreshToken(user: User): Promise<string> {
    return this.generateToken<Partial<ActiveUserData>>(
      user.id,
      this.jwtConfig.refreshTokenTtl,
    );
  }

  /**
   * Generates both access and refresh tokens for a user.
   * @param user - The user object for whom the tokens are being generated.
   * @returns A promise that resolves to an object containing both the access token and refresh token.
   */
  public async generateAccessAndRefreshTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }
}
