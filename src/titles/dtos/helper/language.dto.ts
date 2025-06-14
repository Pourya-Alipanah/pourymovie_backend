import { ApiProperty } from '@nestjs/swagger';

/**
 * This file is part of the "Title Management" project.
 * It defines the Language interface used to represent a language entity.
 */
export class Language {
  /**
   * Unique identifier for the language
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the language',
    name: 'id',
    type: 'number',
    required: true,
  })
  id: number;
  /**
   * Name of the language in English
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the language in English',
    name: 'nameEn',
    type: 'string',
    required: true,
  })
  nameFa: string;
  /**
   * Name of the language in Persian
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the language in Persian',
    name: 'nameFa',
    type: 'string',
    required: true,
  })
  slug: string;
}
