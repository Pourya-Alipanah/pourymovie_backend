import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

/**
 * Data Transfer Object for fetching an entity by its unique identifier.
 * This DTO is used to validate the request parameters when fetching an entity by its ID.
 */
export class GetByIdParamDto {
  /**
   * Unique identifier of the entity to be fetched
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier of the entity to be fetched',
    name: 'id',
    type: 'number',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id: number;
}
