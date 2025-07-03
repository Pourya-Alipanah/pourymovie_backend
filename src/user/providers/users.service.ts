import {
  BadRequestException,
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
  PASSWORD_CANNOT_CHANGED,
  USER_ALREADY_EXISTS_ERROR,
  USER_NOT_FOUND_ERROR,
} from '../constants/users.errors.constants';
import { CreateUserDto } from '../dtos/request/create-user.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { TokenGeneratorProvider } from 'src/auth/providers/token-generator.provider';
import { UpdateUserDto } from '../dtos/request/update-user.dto';
import { UserRole } from '../enums/user-role.enum';
import { IntersectionUserToken } from '../types/intersection-user-token.type';
import { UploadCenterService } from '../../upload-center/providers/upload-center.service';
import { UploadFromEntity } from 'src/upload-center/enums/upload-from-entity.enum';
import { UploadType } from 'src/upload-center/enums/upload-type.enum';

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
   * @param {TokenGeneratorProvider} tokenGeneratorProvider - Provider for generating tokens
   * @param {UploadCenterService} uploadCenterService - Service for handling file uploads
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

    private readonly uploadCenterService: UploadCenterService,
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
    if (user?.avatarUrl) {
      user.avatarUrl = await this.uploadCenterService.getFileUrl(user?.avatarUrl);
    }
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
   * @param {UserRole} role - Role of the user (default is UserRole.USER)
   * @param {boolean} tokenResponse - Whether to return access and refresh tokens (default is true)
   * @returns {Promise<User>} - Created user entity
   * @throws {ConflictException} - If user with the same email already exists
   */
  public async createUser<T extends boolean = true>(
    createUserDto: CreateUserDto,
    role: UserRole = UserRole.USER,
    tokenResponse: T = true as T,
  ): Promise<IntersectionUserToken<T>> {
    try {
      await this.findByEmail(createUserDto.email);
      throw new ConflictException({
        message: USER_ALREADY_EXISTS_ERROR,
      });
    } catch (error) {
      let avatarUrl: string | null = null;
      if (!(error instanceof NotFoundException)) {
        throw error;
      }
      if (createUserDto.avatarUrl) {
        await this.uploadCenterService.confirmUpload(
          createUserDto.avatarUrl.key,
          UploadFromEntity.USER,
          UploadType.AVATAR,
        );
        avatarUrl = `${createUserDto.avatarUrl.bucket}/${createUserDto.avatarUrl.key}`;
      }
      const user = this.usersRepository.create({
        ...createUserDto,
        password: await this.hashingProvider.hash(createUserDto.password),
        role: role,
        avatarUrl,
      });
      const createdUser = await this.usersRepository.save(user);

      if (!tokenResponse) {
        return createdUser as IntersectionUserToken<T>;
      }

      return (await this.tokenGeneratorProvider.generateAccessAndRefreshTokens(
        createdUser,
      )) as IntersectionUserToken<T>;
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

  /**
   * Updates a user by their ID
   * @param {number} id - User ID
   * @param {Partial<CreateUserDto>} updateUserDto - Data transfer object for updating a user
   * @returns {Promise<User>} - Updated user entity
   * @throws {NotFoundException} - If user is not found
   * @throws {BadRequestException} - If password is included in the update
   * @description This method updates a user's information, excluding the password.
   */
  public async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (updateUserDto.password || updateUserDto.confirmPassword) {
      throw new BadRequestException({
        message: PASSWORD_CANNOT_CHANGED,
      });
    }
    const user = await this.findUserById(id);
    let avatarUrl = user.avatarUrl || null;
    if (updateUserDto.avatarUrl) {
      await this.uploadCenterService.confirmUpload(
        updateUserDto.avatarUrl.key,
        UploadFromEntity.USER,
        UploadType.AVATAR,
      );
      avatarUrl = `${updateUserDto.avatarUrl.bucket}/${updateUserDto.avatarUrl.key}`;
    }
    const updatedUser = Object.assign(user, {
      ...updateUserDto,
      avatarUrl,
    });

    return await this.usersRepository.save(updatedUser);
  }
}
