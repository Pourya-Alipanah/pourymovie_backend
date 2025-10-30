import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * This file is part of the "Season Management" project.
 * It defines the CreateSeasonRequestDto used to create a new season.
 */
export class CreateSeasonRequestDto {
  /**
   * Unique identifier for the title associated with the season
   */
  @ApiProperty({
    description: 'Unique identifier for the title associated with the season',
    name: 'titleId',
    type: 'number',
  })
  @IsInt()
  @IsNotEmpty()
  titleId: number;

  /**
   * Number of the season in the series
   * @type {number}
   */
  @ApiProperty({
    description: 'Number of the season in the series',
    name: 'seasonNumber',
    type: 'number',
  })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  seasonNumber: number;

  /**
   * Indicates if the season is a special season (e.g., a mini-series or a special event)
   * @type {boolean}
   */
  @ApiProperty({
    description:
      'Indicates if the season is a special season (e.g., a mini-series or a special event)',
    name: 'specialSeason',
    type: 'boolean',
  })
  @IsBoolean()
  @IsNotEmpty()
  specialSeason: boolean;

  /**
   * Name of the special season, if applicable
   * @type {string | null}
   */
  @ApiProperty({
    description: 'Name of the special season, if applicable',
    name: 'specialSeasonName',
    type: 'string',
    required: false,
  })
  @IsString()
  @IsOptional()
  specialSeasonName: string | null;
}
