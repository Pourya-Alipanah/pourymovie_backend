import { ApiProperty } from '@nestjs/swagger';

/**
 * Interface representing a country.
 * This interface defines the structure of a country object,
 * including its unique identifier, names in Persian and English,
 * and a slug for URL purposes.
 */
export class Country {
  /**
   * Unique identifier for the country
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the country',
  })
  id: number;

  /**
   * Name of the country in Persian
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the country in Persian',
    name: 'nameFa',
    type: 'string',
  })
  nameFa: string;

  /**
   * Name of the country in English
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the country in English',
    name: 'nameEn',
    type: 'string',
  })
  nameEn: string;

  /**
   * Slug for the country, used in URLs
   * @type {string}
   */
  @ApiProperty({
    description: 'Slug for the country, used in URLs',
    name: 'slug',
    type: 'string',
  })
  slug: string;
}
