import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

/**
 * DTO for creating a comment request.
 * @typedef {Object} CreateCommentRequestDto
 */
export class CreateCommentRequestDto {
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
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
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
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  subject: string;

  /**
   * the title ID on which the comment is made
   * @type {number}
   */
  @ApiProperty({
    description: 'The ID of the title on which the comment is made',
    name: 'titleId',
    type: 'number',
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  titleId: number;
}
