import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
/**
 * Data Transfer Object (DTO) for creating a new genre.
 */
export class CreateGenreRequestDto {
  /**
   * Name of the genre in Persian
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the genre in Persian',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  nameFa: string;
  /**
   * Name of the genre in English
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the genre in English',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  nameEn: string;
  /**
   * Slug for the genre, used in URLs
   * @type {string}
   */

  @ApiProperty({
    description: 'Slug for the genre, used in URLs',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
