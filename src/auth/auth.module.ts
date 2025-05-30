import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { TokenGeneratorProvider } from './providers/token-generator.provider';
import { RefreshTokenGeneratorProvider } from './providers/refresh-token-generator.provider';
import { SignInProvider } from './providers/sign-in.provider';
import { UsersModule } from 'src/user/users.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { SetCookieProvider } from './providers/set-cookie.provider';

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
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, HashingProvider, TokenGeneratorProvider],
})
export class AuthModule {}
