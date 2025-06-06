import { ApiProperty } from '@nestjs/swagger';
import { GetUsersDto } from 'src/user/dtos/response/get-users.dto';

/**
 * DTO for representing a comment on a title.
 * @typedef {Object} Comment
 */
export class Comment {
  /**
   * Unique identifier for the comment
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the comment',
    name: 'id',
    type: 'number',
    required: true,
  })
  id: number;

  /**
   * The content of the comment
   * @type {string}
   */
  @ApiProperty({
    description: 'The content of the comment',
    name: 'content',
    type: 'string',
    required: true,
  })
  content: string;

  /**
   * The subject of the comment
   * @type {string}
   */
  @ApiProperty({
    description: 'The subject of the comment',
    name: 'subject',
    type: 'string',
    required: true,
  })
  subject: string;

  /**
   * The timestamp when the comment was created
   * @type {string}
   */
  @ApiProperty({
    description: 'The timestamp when the comment was created',
    name: 'createdAt',
    type: 'string',
    required: true,
  })
  createdAt: string;

  /**
   * user who created the comment
   * @type {GetUsersDto}
   */
  @ApiProperty({
    description: 'User who created the comment',
    name: 'user',
    type: GetUsersDto,
    required: true,
  })
  user: GetUsersDto;
}
