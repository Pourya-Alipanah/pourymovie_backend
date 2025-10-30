import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateNested,
} from 'class-validator';
import { PASSWORD_REGEX } from 'src/user/constants/users.constants';
import { PASSWORD_REGEX_ERROR_MESSAGE } from 'src/user/constants/users.errors.constants';
import { MatchPasswordConstraint } from '../helper/password-confirm-validator';
import { ConfirmUploadRequestDto } from 'src/upload-center/dtos/request/confirm-upload.dto';
import { BufferBucketNames } from 'src/upload-center/enums/bucket-names.enum';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for creating a new user.
 * Validates the input data for creating a user.
 */
export class CreateUserDto {
  /**
   * First name of the user.
   * Must be a string, not empty, and between 3 and 96 characters long.
   */
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    minLength: 3,
    maxLength: 96,
    required: false,
    nullable: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  firstName: string;
  /**
   * Last name of the user.
   * Must be a string, not empty, and between 3 and 96 characters long.
   */
  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    minLength: 3,
    maxLength: 96,
    required: false,
    nullable: true,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(96)
  lastName: string;
  /**
   * Email address of the user.
   * Must be a valid email format, not empty, and up to 96 characters long.
   */
  @ApiProperty({
    description: 'Email address of the user',
    example: '',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;
  /**
   * Password for the user.
   * Must be a string, not empty, at least 8 characters long, and match the defined regex pattern.
   */
  @ApiProperty({
    description:
      'Must be a string, not empty, at least 8 characters long, and special characters',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 96,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(PASSWORD_REGEX, {
    message: PASSWORD_REGEX_ERROR_MESSAGE,
  })
  password: string;

  /**
   * Password confirmation for the user.
   * Must be a string, not empty, at least 8 characters long, and must match the password field.
   */
  @ApiProperty({
    description: 'Password confirmation. Must match the password field.',
    example: 'P@ssw0rd123',
    minLength: 8,
    maxLength: 96,
  })
  @Validate(MatchPasswordConstraint)
  confirmPassword: string;

  /**
   * Avatar URL for the user.
   * Optional field, can be null or a string.
   */
  @ApiProperty({
    description: 'Avatar URL for the user',
    example: {
      bucket: BufferBucketNames.AVATAR,
      key: 'avatar-file-key',
    },
    required: false,
    nullable: true,
    type: ConfirmUploadRequestDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConfirmUploadRequestDto)
  avatarUrl: ConfirmUploadRequestDto;
}
