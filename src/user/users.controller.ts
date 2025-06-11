import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  GetUsersDto,
  GetUsersResponseDto,
} from './dtos/response/get-users.dto';
import { UsersService } from './providers/users.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/paginated-response.decorator';
import { SingleResponseDto } from 'src/common/interceptors/data-response/dtos/single-response.dto';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetSingleUserDto } from './dtos/request/get-single-user.dto';
import { User } from './user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { UpdateUserDto } from './dtos/request/update-user.dto';
import { CreateUserDto } from './dtos/request/create-user.dto';
import { GeneralDoneOperationResponseDto } from 'src/common/dto/response/general-done-operation.dto';
import { UserRole } from './enums/user-role.enum';
import { ADMIN_USER_CREATED_MESSAGE } from './constants/user.message.constants';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

/**
 * Controller for managing users
 * @class UsersController
 * @version 1
 * @description This controller handles user-related operations such as fetching user details.
 */
@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
@Auth(AuthType.Bearer)
export class UsersController {
  /**
   * UsersController
   * @description This controller is responsible for handling user-related operations.
   * It provides endpoints to fetch a list of users and a single user by ID.
   * @param {UsersService} userService - Service for handling user-related logic
   * @returns {UsersController} - Returns an instance of UsersController
   */
  constructor(
    // inject user service
    private readonly userService: UsersService,
  ) {}

  /**
   * Endpoint for create admin
   * @param {CreateUserDto} createUserDto - Data transfer object containing user details for registration
   * @returns {Promise<object>} - Returns a promise that resolves to the created user object
   * @description This endpoint allows users to register by providing their details.
   */
  @ApiOperation({
    summary: 'Create admin user',
  })
  @ApiSingleResponse(GeneralDoneOperationResponseDto)
  @Auth(AuthType.None)
  @Post('admin')
  public async createAdmin(
    @Body() createUserDto: CreateUserDto,
  ): Promise<GeneralDoneOperationResponseDto> {
    const user = (await this.userService.createUser(
      createUserDto,
      UserRole.ADMIN,
      false,
    )) as User;

    return {
      timestamp: user.createdAt,
      message: ADMIN_USER_CREATED_MESSAGE,
    };
  }

  /**
   * Fetches a list of registered users on the application
   * @returns {object} - Returns an object containing user details
   */
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiPaginatedResponse(GetUsersDto)
  @ApiBearerAuth('access-token')
  @Get()
  public getUsers(
    @Query() usersQuery?: PaginationQueryDto,
  ): Promise<GetUsersResponseDto> {
    return this.userService.findAllUsers(usersQuery);
  }

  /**
   * Fetches the current authenticated user
   * @param {ActiveUser} activeUser - Decorator to get the active user from the request
   * @returns {Promise<User>} - Returns the current authenticated user
   */
  @ApiOperation({
    summary: 'Fetches current user details',
  })
  @ApiSingleResponse(GetUsersDto)
  @ApiBearerAuth('access-token')
  @Get('/current')
  public getCurrentUser(
    @ActiveUser() activeUser: ActiveUserData,
  ): Promise<User> {
    return this.userService.findUserById(activeUser.sub);
  }

  /**
   * Fetches a user by their ID
   * @param {GetSingleUserDto} getUserDto - DTO containing the user ID
   * @returns {Promise<User>} - Returns a promise that resolves to the user object
   */
  @ApiOperation({
    summary: 'Fetches a user by their ID',
  })
  @ApiSingleResponse(GetUsersDto)
  @ApiBearerAuth('access-token')
  @Get(':id')
  public getUserById(@Param() getUserDto: GetSingleUserDto): Promise<User> {
    return this.userService.findUserById(getUserDto.id);
  }

  /**
   * Deletes the current user account
   * @description This endpoint allows the current user to delete their account. It soft removes the user from the database.
   * @returns {void}
   */
  @ApiOperation({
    summary: 'Deletes current user account',
    description:
      'This endpoint allows the current user to delete their account. it soft remove the user from the database.',
  })
  @ApiBearerAuth('access-token')
  @Auth(AuthType.Bearer)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  public deleteUser(@ActiveUser() activeUser: ActiveUserData) {
    return this.userService.deleteUser(activeUser.sub);
  }

  /**
   * Updates the current user's details
   * @param {ActiveUser} activeUser - Decorator to get the active user from the request
   * @param {UpdateUserDto} updateUserDto - DTO containing the updated user details
   * @returns {Promise<User>} - Returns the updated user object
   */
  @ApiOperation({
    summary: 'updates current user account',
    description:
      'This endpoint allows the current user to delete their account. it soft remove the user from the database.',
  })
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetUsersDto)
  @Patch()
  public updateUser(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(activeUser.sub, updateUserDto);
  }
}
