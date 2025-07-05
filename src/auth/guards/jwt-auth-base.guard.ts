import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';

/**
 * Base class for JWT authentication guards
 * @abstract
 * @class JwtAuthGuardBase
 * @implements {CanActivate}
 * @description This class provides the base functionality for JWT authentication guards, including token extraction and user attachment to the context.
 */
export abstract class JwtAuthGuardBase implements CanActivate {
  /**
   * Creates an instance of JwtAuthGuardBase.
   * @param {JwtService} jwtService - The JWT service for token verification.
   * @param {ConfigType<typeof jwtConfig>} jwtConfiguration - The JWT configuration.
   */
  constructor(
    protected readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  /**
   * Abstract method to extract the token from the execution context.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {string | undefined} - The extracted token if present, otherwise undefined.
   */
  protected abstract extractToken(
    context: ExecutionContext,
  ): string | undefined;

  /**
   * CanActivate method to check if the request can be activated based on the JWT token.
   * @param {ExecutionContext} context - The execution context of the request.
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the request can be activated, otherwise throws an UnauthorizedException.
   * @throws {UnauthorizedException} - If the user is not authenticated or does not have the required permissions.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractToken(context);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
      this.attachUserToContext(context, payload);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  /**
   * Abstract method to attach the user data to the execution context.
   * @param {ExecutionContext} context - The execution context of the request.
   * @param {ActiveUserData} payload - The user data to attach.
   */
  protected attachUserToContext(
    context: ExecutionContext,
    payload: ActiveUserData,
  ) {}
}
