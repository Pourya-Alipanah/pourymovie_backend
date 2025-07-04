import { Genre } from 'src/genre/dtos/helper/genre.dto';
import { Language } from 'src/language/dtos/helper/language.dto';
import { PersonDto } from 'src/people/dtos/helper/person.dto';
import { ApiProperty } from '@nestjs/swagger';
import { TitleType } from 'src/titles/enums/title-type.enum';
import { Country } from '../../../country/dtos/helper/country.dto';
import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';

/**
 * DTO for returning detailed information about a title.
 * @typedef {Object} GetTitleDetailsResponseDto
 * @property {number} id - Unique identifier for the title
 * @property {string} titleFa - Persian title of the title
 * @property {string} titleEn - English title of the title
 * @property {string} slug - Slug for the title, used in URLs
 * @property {TitleType} type - Type of the title (e.g., Movie, Series)
 * @property {number} releaseYear - Release year of the title
 * @property {number} durationMinutes - Duration of the title in minutes
 * @property {number} imdbRating - IMDB rating of the title
 * @property {number} imdbVotes - Number of votes on IMDB for the title
 * @property {boolean} isTop250 - Indicates if the title is part of the top 250 list
 * @property {number} top250Rank - Rank of the title in the top 250 list, if applicable
 * @property {string} summary - Summary of the title
 * @property {string} ageRating - Age rating of the title
 * @property {boolean} hasSubtitle - Indicates if the title has subtitles available
 * @property {string} awards - Awards won by the title
 * @property {Language} language - Language of the title
 * @property {Genre[]} genres - Genres associated with the title
 * @property {Country} country - Country of origin for the title
 * @property {Season[]} seasons - Seasons of the title, if applicable
 * @property {VideoLink[]} videoLinks - Video links for the title
 * @property {PersonDto[]} people - People associated with the title (e.g., actors, directors)
 * @property {Comment[]} comments - Comments on the title
 */
export class GetTitlesResponseDto {
  /**
   * Unique identifier for the title
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the title',
    name: 'id',
  })
  id: number;
  /**
   * Persian title of the title
   * @type {string}
   */
  @ApiProperty({
    description: 'Persian title of the title',
    name: 'titleFa',
  })
  titleFa: string;
  /**
   * English title of the title
   * @type {string}
   */
  @ApiProperty({
    description: 'English title of the title',
    name: 'titleEn',
  })
  titleEn: string;
  /**
   * Slug for the title, used in URLs
   * @type {string}
   */
  @ApiProperty({
    description: 'Slug for the title, used in URLs',
    name: 'slug',
  })
  slug: string;
  /**
   * Type of the title (e.g., Movie, Series)
   * @type {TitleType}
   */
  @ApiProperty({
    description: 'Type of the title (e.g., Movie, Series)',
    name: 'type',
    enum: TitleType,
  })
  type: TitleType;
  /**
   * Release year of the title
   * @type {number}
   */
  @ApiProperty({
    description: 'Release year of the title',
    name: 'releaseYear',
  })
  releaseYear: number;
  /**
   * IMDB rating of the title
   * @type {number}
   */
  @ApiProperty({
    description: 'IMDB rating of the title',
    name: 'imdbRating',
  })
  imdbRating: number;
  /**
   * Indicates if the title is part of the top 250 list
   * @type {boolean}
   */
  @ApiProperty({
    description: 'Indicates if the title is part of the top 250 list',
    name: 'isTop250',
  })
  isTop250: boolean;
  /**
   * Rank of the title in the top 250 list, if applicable
   * @type {number}
   */
  @ApiProperty({
    description: 'Rank of the title in the top 250 list, if applicable',
    name: 'top250Rank',
  })
  top250Rank: number;
  /**
   * Summary of the title
   * @type {string}
   */
  @ApiProperty({
    description: 'Summary of the title',
    name: 'summary',
  })
  summary: string;
  /**
   * Indicates if the title has subtitles available
   * @type {boolean}
   */
  @ApiProperty({
    description: 'Indicates if the title has subtitles available',
    name: 'hasSubtitle',
  })
  hasSubtitle: boolean;
  /**
   * Awards won by the title
   * @type {string}
   */
  @ApiProperty({
    description: 'Awards won by the title',
    name: 'awards',
  })
  awards: string;

  /**
   * trailer video URL
   * @type {string | null}
   */
  @ApiProperty({
    description: 'Trailer video URL',
    name: 'trailerUrl',
    nullable: true,
    type: String,
  })
  trailerUrl: string | null;

  /**
   * Cover image URL
   * @type {string | null}
   */
  @ApiProperty({
    description: 'Cover image URL',
    name: 'coverUrl',
    nullable: true,
    type: String,
  })
  coverUrl: string | null;

  /**
   * Thumbnail image URL
   * @type {string | null}
   */
  @ApiProperty({
    description: 'Thumbnail image URL',
    name: 'thumbnailUrl',
    nullable: true,
    type: String,
  })
  thumbnailUrl: string | null;

  /**
   * Language of the title
   * @type {Language}
   */
  @ApiProperty({
    description: 'Language of the title',
    name: 'language',
    type: Language,
  })
  language: Language;
  /**
   * Genres associated with the title
   * @type {Genre[]}
   */
  @ApiProperty({
    description: 'Genres associated with the title',
    name: 'genres',
    isArray: true,
    type: Genre,
  })
  genres: Genre[];
  /**
   * Country of origin for the title
   * @type {Country}
   */
  @ApiProperty({
    description: 'Country of origin for the title',
    name: 'country',
    type: Country,
  })
  country: Country;

  /**
   * actors of the title
   * @type {PersonDto[]}
   */
  @ApiProperty({
    description: 'actors of the title',
    name: 'actors',
    isArray: true,
    type: PersonDto,
  })
  actors: PersonDto[];

  /**
   * directors of the title
   * @type {PersonDto[]}
   */
  @ApiProperty({
    description: 'directors of the title',
    name: 'directors',
    isArray: true,
    type: PersonDto,
  })
  directors: PersonDto[];

  /**
   * writers of the title
   * @type {PersonDto[]}
   */
  @ApiProperty({
    description: 'writers of the title',
    name: 'writers',
    isArray: true,
    type: PersonDto,
  })
  writers: PersonDto[];
}

/**
 * Response DTO for paginated list of titles.
 */
export class GetTitlesResponse extends PaginationResponseDto<GetTitlesResponseDto> {}
