import { HttpAccessTokenGuard } from './guards/http-access-token.guard';
import { WsAccessTokenGuard } from './guards/ws-access-token.guard';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { CheckRoleGuard } from './guards/check-role.guard';
import { TokenGeneratorProvider } from './providers/token-generator.provider';
import { HashingProvider } from './providers/hashing.provider';
import { AuthService } from './providers/auth.service';
import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/user/users.module';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SetCookieProvider } from './providers/set-cookie.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { RefreshTokenGeneratorProvider } from './providers/refresh-token-generator.provider';
import { AuthController } from './auth.controller';
import { WsAuthService } from './providers/ws-auth.service';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenGeneratorProvider,
    RefreshTokenGeneratorProvider,
    SignInProvider,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SetCookieProvider,
    HttpAccessTokenGuard,
    WsAccessTokenGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    CheckRoleGuard,
    WsAuthService,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [
    AuthService,
    HashingProvider,
    TokenGeneratorProvider,
    HttpAccessTokenGuard,
    WsAccessTokenGuard,
    AuthenticationGuard,
    AuthorizationGuard,
    CheckRoleGuard,
    JwtModule,
    WsAuthService
  ],
})
export class AuthModule {}
