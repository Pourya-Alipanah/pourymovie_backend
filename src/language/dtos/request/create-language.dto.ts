import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * This file is part of the "Language Management" project.
 * It defines the CreateRequestLanguageDto class used for creating a new language.
 */
export class CreateLanguageRequestDto {
  /**
   * Name of the language in Persian
   * @type {string}
   */
  @ApiProperty({
    description: 'Name of the language in Persian',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nameFa: string;
  /**
   * slug of the language
   * @type {string}
   */
  @ApiProperty({
    description: 'slug of the language',
    type: 'string',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}
