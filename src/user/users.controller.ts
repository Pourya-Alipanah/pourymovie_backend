import { Controller, Get, Param, Post, Query } from '@nestjs/common';
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
   * Fetches a list of registered users on the application
   * @returns {object} - Returns an object containing user details
   */
  @Get()
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiPaginatedResponse(GetUsersDto)
  @ApiBearerAuth('access-token')
  @Auth(AuthType.Bearer)
  public getUsers(
    @Query() usersQuery?: PaginationQueryDto,
  ): Promise<GetUsersResponseDto> {
    return this.userService.findAllUsers(usersQuery);
  }


  /**
   * Fetches a user by their ID
   * @param {GetSingleUserDto} getUserDto - DTO containing the user ID
   * @returns {Promise<User>} - Returns a promise that resolves to the user object
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Fetches a user by their ID',
  })
  @ApiSingleResponse(GetUsersDto)
  @ApiBearerAuth('access-token')
  @Auth(AuthType.Bearer)
  public getUserById(
    @Param() getUserDto: GetSingleUserDto,
  ): Promise<User> {
    return this.userService.findUserById(getUserDto.id);
  }


  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  @Auth(AuthType.None)
  public createUser() {
    return this.userService.createUser();
  }
}
