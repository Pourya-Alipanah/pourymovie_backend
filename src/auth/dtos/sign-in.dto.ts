import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object for user sign-in.
 * @class SignInDto
 * @description This DTO is used to validate the data received during user sign-in.
 */
export class SignInDto {
  /**
   * The email address of the user.
   * @type {string}
   */
  @ApiProperty({
    description: 'The email address of the user',
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user.
   * @type {string}
   */
  @ApiProperty({
    description: 'The password of the user',
    type: String,
  })
  @IsNotEmpty()
  password: string;
}
