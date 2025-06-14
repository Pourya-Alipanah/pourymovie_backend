import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a person without a specific role in a title.
 * This interface is used to define the basic properties of a person.
 */
export class PersonDto {
  /**
   * Unique identifier for the person
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the person',
    name: 'id',
    type: 'number',
    required: true,
  })
  id: number;

  /**
   * Name of the person in Persian
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the person in Persian',
    name: 'nameFa',
    type: 'string',
    required: true,
  })
  nameFa: string;

  /**
   * Name of the person in English
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the person in English',
    name: 'nameEn',
    type: 'string',
    required: true,
  })
  nameEn: string;

  /**
   * Slug for the person, used in URLs
   * @type {string}
   */
  @ApiProperty({
    description: 'Slug for the person, used in URLs',
    name: 'slug',
    type: 'string',
    required: true,
  })
  slug: string;

  /**
   * Birth date of the person in ISO format
   * @type {string}
   */
  @ApiProperty({
    description: 'Birth date of the person in ISO format',
    name: 'birthDate',
    type: 'string',
    required: true,
  })
  birthDate: string;

  /**
   * Death date of the person in ISO format
   * @type {string}
   */
  @ApiProperty({
    description: 'Death date of the person in ISO format, null if alive',
    name: 'deathDate',
    type: 'string',
    required: false,
    nullable: true,
  })
  deathDate: string | null;

  /**
   * Place of birth of the person
   * @type {string}
   */
  @ApiProperty({
    description: 'Place of birth of the person',
    name: 'birthPlace',
    type: 'string',
    required: true,
  })
  birthPlace: string;

  /**
   * image URL of the person
   * @type {string}
   */
  @ApiProperty({
    description: 'Image URL of the person',
    name: 'imageUrl',
    type: 'string',
    required: true,
  })
  imageUrl: string;
}
