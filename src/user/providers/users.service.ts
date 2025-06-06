import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GetUsersDto,
  GetUsersResponseDto,
} from '../dtos/response/get-users.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import {
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../constants/users.errors.constants';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { AuthService } from 'src/auth/providers/auth.service';
import { RefreshTokenGeneratorProvider } from 'src/auth/providers/refresh-token-generator.provider';
import { TokenGeneratorProvider } from 'src/auth/providers/token-generator.provider';

/**
 * UserService
 * @description This service is responsible for handling user-related logic.
 */
@Injectable()
export class UsersService {
  /**
   * Constructor for UsersService
   * @param {PaginationService} paginationService - Service for handling pagination
   * @param {Repository<User>} usersRepository - Repository for user entity
   * @param {HashingProvider} hashingProvider - Provider for hashing passwords
   * @description Initializes the UsersService with necessary dependencies.
   */
  constructor(
    // inject pagination service
    private readonly paginationService: PaginationService,

    //inject users repository
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    // inject hashing provider
    @Inject(forwardRef(() => HashingProvider))
    private readonly hashingProvider: HashingProvider,

    // inject token generator provider
    @Inject(forwardRef(() => TokenGeneratorProvider))
    private readonly tokenGeneratorProvider: TokenGeneratorProvider,
  ) {}

  /**
   * Fetches all users with pagination
   * @param {PaginationQueryDto} params - Pagination parameters
   * @returns {Promise<GetUsersResponseDto>} - Paginated list of users
   */
  public async findAllUsers(
    params?: PaginationQueryDto,
  ): Promise<GetUsersResponseDto> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('user')
      .select();

    const result = await this.paginationService.paginated<User, GetUsersDto>(
      queryBuilder,
      params,
    );
    return result;
  }

  /**
   * Finds a user by their ID
   * @param {number} id - User ID
   * @returns {Promise<User>} - User entity
   * @throws {NotFoundException} - If user is not found
   */
  public async findUserById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException({
        message: USER_NOT_FOUND_ERROR,
      });
    }
    return user;
  }

  /**
   * Finds a user by their email
   * @param {string} email - User email
   * @returns {Promise<User>} - User entity
   * @throws {NotFoundException} - If user is not found
   */
  public async findByEmail(email: string) {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException({
        message: USER_NOT_FOUND_ERROR,
      });
    }
    return user;
  }

  /**
   * Creates a new user
   * @param {CreateUserDto} createUserDto - Data transfer object for creating a user
   * @returns {Promise<User>} - Created user entity
   * @throws {ConflictException} - If user with the same email already exists
   */
  public async createUser(createUserDto: CreateUserDto) {
    try {
      await this.findByEmail(createUserDto.email);
      throw new ConflictException({
        message: USER_ALREADY_EXISTS_ERROR,
      });
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
      const user = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hash(createUserDto.password),
      });
      const createdUser = await this.usersRepository.save(user);

      return await this.tokenGeneratorProvider.generateAccessAndRefreshTokens(
        createdUser,
      );
    }
  }

  /**
   * soft delete the user
   * @param {number} id - target user ID
   * @returns {Object} - empty object
   * @throws {NotFoundException} - If user is not found
   */
  public async deleteUser(id: number) {
    await this.findUserById(id);
    await this.usersRepository.softDelete(id);
  }
}
