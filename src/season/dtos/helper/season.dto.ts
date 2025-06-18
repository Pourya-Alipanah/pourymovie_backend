import { ApiProperty } from '@nestjs/swagger';
import { Episode } from 'src/titles/dtos/helper/episode.dto';

/**
 * This file is part of the "Title Management" project.
 * It defines the Season interface used to represent a season of a TV series or show.
 */
export class Season {
  /**
   * Unique identifier for the season
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the season',
    name: 'id',
    type: 'number',
  })
  id: number;

  /**
   * Number of the season in the series
   * @type {number}
   */
  @ApiProperty({
    description: 'Number of the season in the series',
    name: 'seasonNumber',
    type: 'number',
  })
  seasonNumber: number;

  /**
   * episodes in the season
   * @type {Episode[]}
   */
  @ApiProperty({
    description: 'Episodes in the season',
    name: 'episodes',
    type: [Episode],
  })
  episodes: Episode[];

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
  specialSeasonName: string | null;
}
