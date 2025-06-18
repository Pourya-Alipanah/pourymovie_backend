import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TitleType } from 'src/titles/enums/title-type.enum';
import { CreateTitlePersonRequestDto } from './create-title-person.dto';
import { Type } from 'class-transformer';

/**
 * Data Transfer Object for creating a new title (movie or series).
 * This DTO defines the structure and validation rules for the title creation request.
 */
export class CreateTitleDto {
  /** Persian title of the movie or series */
  @ApiProperty({
    example: 'فیلم نمونه',
    description: 'persian title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  titleFa: string;

  /** Original (English) title of the movie or series */
  @ApiProperty({
    example: 'Sample Movie',
    description: 'original title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  /** Slug used in the URL (must be unique and SEO-friendly) */
  @ApiProperty({
    example: 'sample-movie',
    description: 'slug for url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  /** ID of the country where the title was produced */
  @ApiProperty({ example: 1, description: 'id of country', required: true })
  @IsNumber()
  @IsNotEmpty()
  countryId: number;

  /** Array of genre IDs associated with the title */
  @ApiProperty({ example: [1, 2], description: 'genres ids' })
  @IsArray()
  @IsNumber({}, { each: true })
  genreIds: number[] | null;

  /** ID of the main spoken language in the title */
  @ApiProperty({ example: 1, description: 'movie language id', required: true })
  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  /** Release year of the title */
  @ApiProperty({
    example: '2023-10-01',
    description: 'release date',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;

  /** URL of the trailer video */
  @ApiProperty({
    example: 'https://example.com/trailer.mp4',
    description: 'trailer video URL',
  })
  @IsString()
  trailerUrl: string | null;

  /** URL of the cover image */
  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'cover image URL',
  })
  @IsString()
  coverUrl: string | null;

  /** URL of the thumbnail image */
  @ApiProperty({
    example: 'https://example.com/thumbnail.jpg',
    description: 'thumbnail image URL',
  })
  @IsString()
  thumbnailUrl: string | null;

  /** IDs of people involved (e.g., actors, directors, writers) */

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTitlePersonRequestDto)
  titlePeople: CreateTitlePersonRequestDto[];

  /** Duration of the title in minutes */
  @ApiProperty({
    example: 178,
    description: 'duration of the movie in minutes',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;

  /** IMDB rating score */
  @ApiProperty({
    example: 9.1,
    description: 'IMDB rating of the movie',
    type: Number,
  })
  @IsNumber()
  imdbRating: number | null;

  /** Number of IMDB votes received */
  @ApiProperty({
    example: 700000,
    description: 'IMDB votes of the movie',
    type: Number,
  })
  @IsNumber()
  imdbVotes: number | null;

  /** Age rating (e.g., G, PG-13, R) */
  @ApiProperty({
    example: 'PG-13',
    description: 'age rating of the movie',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  ageRating: string;

  /** Short summary or description of the title */
  @ApiProperty({
    example: 'This is a sample movie summary.',
    description: 'summary of the movie',
  })
  @IsString()
  summary: string | null;

  /** Indicates if the movie or series has subtitles */
  @ApiProperty({
    example: true,
    description: 'indicates if the movie has subtitles',
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  hasSubtitle: boolean;

  /** List of awards the title has received */
  @ApiProperty({
    example: 'Best Picture',
    description: 'awards won by the movie',
  })
  @IsString()
  awards: string | null;

  /** Indicates if the title is listed in IMDB Top 250 */
  @ApiProperty({
    example: false,
    description: 'indicates if the movie is part of top 250',
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isTop250: boolean;

  /** Rank position in IMDB Top 250 (if applicable) */
  @ApiProperty({
    example: 100,
    description: 'rank of the movie in top 250',
    type: Number,
  })
  @IsNumber()
  top250Rank: number | null;

  /** Type of the title (movie or series) */
  @ApiProperty({
    example: 'movie',
    description: 'type of the title (e.g., movie, series)',
    enum: TitleType,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TitleType)
  type: TitleType;

  /** List of video link IDs associated with the title */
  @ApiProperty({
    example: [1, 2],
    description: 'IDs of video links associated with the title',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  videoLinkIds?: number[];
}
