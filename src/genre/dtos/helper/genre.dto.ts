import { ApiProperty } from '@nestjs/swagger';

/**
 * Interface representing a genre in the system.
 * This interface defines the structure of a genre object,
 */
export class Genre {
  /**
   * Unique identifier for the genre
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the genre',
    name: 'id',
    type: 'number',
  })
  id: number;
  /**
   * Name of the genre in Persian
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the genre in Persian',
    name: 'nameFa',
    type: 'string',
  })
  nameFa: string;
  /**
   * Name of the genre in English
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the genre in English',
    name: 'nameEn',
    type: 'string',
  })
  nameEn: string;
  /**
   * Slug for the genre, used in URLs
   * @type {string}
   */

  @ApiProperty({
    description: 'Slug for the genre, used in URLs',
    name: 'slug',
    type: 'string',
  })
  slug: string;
}
