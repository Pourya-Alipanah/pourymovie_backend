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

export abstract class JwtAuthGuardBase implements CanActivate {
  constructor(
    protected readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  protected abstract extractToken(
    context: ExecutionContext,
  ): string | undefined;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = this.extractToken(context);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token,this.jwtConfiguration);
      this.attachUserToContext(context, payload);
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }

  protected attachUserToContext(context: ExecutionContext, payload: ActiveUserData) {}
}
