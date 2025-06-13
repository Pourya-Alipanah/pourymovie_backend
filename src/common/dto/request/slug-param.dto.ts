import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * Data Transfer Object for fetching an entity by its slug.
 * This DTO is used to validate the request parameters when fetching an entity by its slug.
 */
export class GetBySlugParamDto {
  /**
   * Slug of the entity to be fetched
   * @type {string}
   */
  @ApiProperty({
    description: 'Slug of the entity to be fetched',
    name: 'slug',
    type: 'string',
    required: true,
  })
  @IsString()
  slug: string;
}
