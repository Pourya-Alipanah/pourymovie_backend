import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


/**
 * Controller for managing users
 * @class UsersController
 * @version 1
 * @description This controller handles user-related operations such as fetching user details.
 */
@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class UsersController {
  @Get()
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetched successfully based on the query',
  })

  public getUsers() {
    return {
      name: 'John Doe',
      age: 30,
      email: '',
    };
  }
}
