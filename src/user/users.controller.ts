import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiPaginatedResponse(GetUsersDto)
  @ApiBearerAuth('access-token')
  @Auth(AuthType.Bearer)
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
  @Auth(AuthType.Bearer)
  @Get('/current')
  public getCurrentUser(
    @ActiveUser() activeUser: ActiveUserData,
  ): Promise<User> {
    console.log(activeUser.sub);
    
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
  @Auth(AuthType.Bearer)
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
}
