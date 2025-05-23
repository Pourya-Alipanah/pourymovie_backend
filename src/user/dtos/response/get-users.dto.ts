import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';

/**
 * DTO for returning user data.
 * @class GetUsersResponseDto
 * @description Data Transfer Object for user information returned in API responses.
 * @property {number} id - Unique identifier for the user.
 * @property {string} firstName - First name of the user.
 * @property {string} lastName - Last name of the user.
 * @property {string} email - Email address of the user.
 * @property {Date} createdAt - Timestamp when the user was created.
 * @property {Date} updateAt - Timestamp when the user was last updated.
 * @property {Date} deletedAt - Timestamp when the user was deleted.
 * @property {boolean} hasSubscription - Indicates if the user has an active subscription.
 */
export class GetUsersDto {
  /**
   * Unique identifier for the user
   * @type {number}
   */
  @ApiProperty({ description: 'Unique identifier for the user' })
  id: number;

  /**
   * First name of the user
   * @type {string}
   */
  @ApiProperty({ description: 'First name of the user' })
  firstName: string;

  /**
   * Last name of the user
   * @type {string}
   */
  @ApiProperty({ description: 'Last name of the user' })
  lastName: string;

  /**
   * Email address of the user
   * @type {string}
   */
  @ApiProperty({ description: 'Email address of the user' })
  email: string;

  /**
   * Timestamp when the user was created
   * @type {Date}
   */
  @ApiProperty({
    description: 'Timestamp when the user was created',
    type: Date,
  })
  createdAt: Date;

  /**
   * Timestamp when the user was last updated
   * @type {Date | null}
   */
  @ApiProperty({
    description: 'Timestamp when the user was last updated',
    type: Date,
    nullable: true,
  })
  updateAt: Date | null;

  /**
   * Timestamp when the user was deleted
   * @type {Date | null}
   */
  @ApiProperty({
    description: 'Timestamp when the user was deleted',
    type: Date,
    nullable: true,
  })
  deletedAt: Date | null;

  /**
   * Indicates if the user has an active subscription
   * @type {boolean}
   */
  @ApiProperty({
    description: 'Indicates if the user has an active subscription',
  })
  hasSubscription: boolean;
}


/**
 * DTO for paginated response of user data.
 * @class GetUsersResponseDto
 * @description Data Transfer Object for paginated user information returned in API responses.
 * @extends PaginationResponseDto<GetUsersDto>
 */
export class GetUsersResponseDto extends PaginationResponseDto<GetUsersDto> {}
