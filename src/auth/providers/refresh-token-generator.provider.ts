import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import jwtConfig from '../config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import { UsersService } from 'src/user/providers/users.service';
import { TokenGeneratorProvider } from './token-generator.provider';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { User } from 'src/user/user.entity';

/**
 * Provider for generating refresh tokens
 * @class RefreshTokenGeneratorProvider
 * @version 1
 * @description This provider is responsible for generating refresh tokens.
 * It uses the JwtService to create and verify JWT tokens.
 */
@Injectable()
export class RefreshTokenGeneratorProvider {
  /**
   * RefreshTokenGeneratorProvider
   * @description This provider is responsible for generating refresh tokens.
   * It uses the JwtService to create and verify JWT tokens.
   * @param {JwtService} jwtService - Service for handling JWT operations
   * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - Configuration for JWT settings
   * @param {UsersService} usersService - Service for handling user-related operations
   * @param {TokenGeneratorProvider} tokenGeneratorProvider - Provider for generating tokens
   */
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly tokenGeneratorProvider: TokenGeneratorProvider,
  ) {}

  /**
   * Refreshes the access and refresh tokens using the provided refresh token
   * @param {RefreshTokenDto} refreshTokenDto - Data transfer object containing the refresh token
   * @returns {Promise<object>} - Returns a promise that resolves to an object containing new access and refresh tokens
   * @throws {UnauthorizedException} - Throws an exception if the refresh token is invalid or expired
   */
  public async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub: userId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      const user: User = await this.usersService.findUserById(userId);
      return this.tokenGeneratorProvider.generateAccessAndRefreshTokens(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('User not found');
      }

      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
