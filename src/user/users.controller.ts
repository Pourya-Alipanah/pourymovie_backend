import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUsersResponseDto } from './dtos/response/get-users.dto';
import { UsersService } from './providers/users.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';

/**
 * Controller for managing users
 * @class UsersController
 * @version 1
 * @description This controller handles user-related operations such as fetching user details.
 */
@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class UsersController {
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
  @ApiOkResponse({
    description: 'Users fetched successfully based on the query',
    type: GetUsersResponseDto,
  })
  @ApiBearerAuth('access-token')
  public getUsers(
    @Query() usersQuery?: PaginationQueryDto,
  ): Promise<GetUsersResponseDto> {
    return this.userService.findAllUsers(usersQuery);
  }
}
