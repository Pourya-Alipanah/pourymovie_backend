import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

/**
 * DTO for retrieving a single user.
 */
export class GetSingleUserDto {
  /**
   * Unique identifier for the user
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the user',
    name: 'id',
    type: 'number',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id: number;
}
