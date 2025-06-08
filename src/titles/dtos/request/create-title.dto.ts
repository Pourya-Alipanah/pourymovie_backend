import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TitleType } from 'src/titles/enums/title-type.enum';

export class CreateTitleDto {
  @ApiProperty({
    example: 'فیلم نمونه',
    description: 'persian title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  titleFa: string;

  @ApiProperty({
    example: 'Sample Movie',
    description: 'original title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  titleEn: string;

  @ApiProperty({
    example: 'sample-movie',
    description: 'slug for url',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 1, description: 'id of country', required: true })
  @IsNumber()
  @IsNotEmpty()
  countryId: number;

  @ApiProperty({ example: [1, 2], description: 'genres ids' })
  @IsArray()
  @IsNumber({}, { each: true })
  genreIds: number[] | null;

  @ApiProperty({ example: 1, description: 'movie language id', required: true })
  @IsNumber()
  @IsNotEmpty()
  languageId: number;

  @ApiProperty({
    example: '2023-10-01',
    description: 'release date',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  releaseYear: number;

  @ApiProperty({
    example: 'https://example.com/trailer.mp4',
    description: 'trailer video URL',
  })
  @IsString()
  trailerUrl: string | null;

  @ApiProperty({
    example: 'https://example.com/cover.jpg',
    description: 'cover image URL',
  })
  @IsString()
  coverUrl: string | null;

  @ApiProperty({
    example: 'https://example.com/thumbnail.jpg',
    description: 'thumbnail image URL',
  })
  @IsString()
  thumbnailUrl: string | null;

  @ApiProperty({
    example: [1, 2],
    description:
      'person that involve in the movie that can be actor director or writer',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  titlePersonIds: number[] | null;

  @ApiProperty({
    example: 178,
    description: 'duration of the movie in minutes',
    type: Number,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  durationMinutes: number;

  @ApiProperty({
    example: 9.1,
    description: 'IMDB rating of the movie',
    type: Number,
  })
  @IsNumber()
  imdbRating: number | null;

  @ApiProperty({
    example: 700000,
    description: 'IMDB votes of the movie',
    type: Number,
  })
  @IsNumber()
  imdbVotes: number | null;

  @ApiProperty({
    example: 'PG-13',
    description: 'age rating of the movie',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  ageRating: string;

  @ApiProperty({
    example: 'This is a sample movie summary.',
    description: 'summary of the movie',
  })
  @IsString()
  summary: string | null;

  @ApiProperty({
    example: true,
    description: 'indicates if the movie has subtitles',
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  hasSubtitle: boolean;

  @ApiProperty({
    example: 'Best Picture',
    description: 'awards won by the movie',
  })
  @IsString()
  awards: string | null;

  @ApiProperty({
    example: false,
    description: 'indicates if the movie is part of top 250',
    type: Boolean,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  isTop250: boolean;

  @ApiProperty({
    example: 100,
    description: 'rank of the movie in top 250',
    type: Number,
  })
  @IsNumber()
  top250Rank: number | null;

  @ApiProperty({
    example: 'movie',
    description: 'type of the title (e.g., movie, series)',
    enum: TitleType,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(TitleType)
  type: TitleType;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs of seasons for series titles',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  seasonIds?: number[]; // Optional, for series titles

  @ApiProperty({
    example: [1, 2],
    description: 'IDs of video links associated with the title',
    type: [Number],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  videoLinkIds?: number[]; // Optional, for video links associated with the title
}
