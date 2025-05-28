import { Injectable } from '@nestjs/common';
import { SignInProvider } from './sign-in.provider';
import { RefreshTokenGeneratorProvider } from './refresh-token-generator.provider';
import { SignInDto } from '../dtos/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly signInProvider: SignInProvider,

    private readonly refreshTokenGeneratorProvider: RefreshTokenGeneratorProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    return this.signInProvider.signIn(signInDto);
  }

  public async refreshToken(userId: number, refreshToken: string) {
    throw new Error('Method not implemented.');
  }
}
