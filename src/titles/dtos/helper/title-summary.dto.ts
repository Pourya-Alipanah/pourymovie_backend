import { ApiProperty } from '@nestjs/swagger';
import { TitleType } from 'src/titles/enums/title-type.enum';

/**
 * Data Transfer Object representing a summary of a title.
 * This DTO includes the unique identifier, titles in Persian and English,
 * slug for URL, type of the title, and thumbnail URL.
 */
export class TitleSummaryDto {
  /**
   * Unique identifier for the title
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the title',
    type: 'number',
    required: true,
    example: 1,
  })
  id: number;

  /**
   * Persian title of the title
   * @type {string}
   */
  @ApiProperty({
    description: 'Persian title of the title',
    type: 'string',
    required: true,
    example: 'عنوان فارسی',
  })
  titleFa: string;

  /**
   * English title of the title
   * @type {string}
   */
  @ApiProperty({
    description: 'English title of the title',
    type: 'string',
    required: true,
    example: 'English Title',
  })
  titleEn: string;

  /**
   * Slug for the title, used in URLs
   * @type {string}
   */
  @ApiProperty({
    description: 'Slug for the title, used in URLs',
    type: 'string',
    required: true,
    example: 'english-title',
  })
  slug: string;

  /**
   * Type of the title (e.g., Movie, Series)
   * @type {TitleType}
   */
  @ApiProperty({ enum: TitleType })
  type: TitleType;

  /**
   * Release year of the title
   * @type {string | null}
   */
  @ApiProperty({
    nullable: true,
    description: 'Release year of the title',
    type: 'string',
  })
  tumbnailUrl: string | null;
}
