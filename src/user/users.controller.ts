import { Controller, Get } from '@nestjs/common';

@Controller({ path: 'users', version: '1' })
export class UsersController {
  @Get()
  public getUser() {
    return {
      name: 'John Doe',
      age: 30,
      email: '',
    };
  }
}
