import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/user/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { TokenGeneratorProvider } from './token-generator.provider';
import { SignInDto } from '../dtos/sign-in.dto';
import { User } from 'src/user/user.entity';

/**
 * SignInProvider is a service that handles user sign-in functionality.
 * It verifies user credentials and generates access and refresh tokens upon successful sign-in.
 * It uses the UsersService to retrieve user information and the HashingProvider to verify passwords.
 * It also utilizes the TokenGeneratorProvider to create tokens for authenticated users.
 * This provider is essential for implementing secure user authentication in the application.
 */
@Injectable()
export class SignInProvider {
  /**
   * Constructor for SignInProvider.
   * @param usersService - The service to interact with user data.
   * @param hashingProvider - The provider for hashing and comparing passwords.
   * @param tokenGeneratorProvider - The provider for generating access and refresh tokens.
   */
  constructor(
    private readonly usersService: UsersService,
    private readonly hashingProvider: HashingProvider,
    private readonly tokenGeneratorProvider: TokenGeneratorProvider,
  ) {}

  /**
   * Signs in a user by verifying their credentials and generating tokens.
   * @param signInDto - The data transfer object containing user email and password.
   * @returns A promise that resolves to an object containing access and refresh tokens.
   * @throws UnauthorizedException if the credentials are invalid or the user is not found.
   */
  public async signIn(signInDto: SignInDto) {
    let user: User;
    try {
      user = await this.usersService.findByEmail(signInDto.email);
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException({ message: 'Invalid credentials' });
      }
      throw err;
    }

    const isPasswordValid = await this.hashingProvider.compare(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException({ message: 'Invalid credentials' });
    }

    return await this.tokenGeneratorProvider.generateAccessAndRefreshTokens(
      user,
    );
  }
}
