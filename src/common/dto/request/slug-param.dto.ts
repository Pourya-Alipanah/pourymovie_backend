import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
