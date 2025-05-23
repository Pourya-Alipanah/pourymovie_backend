import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';
import { PaginatedResponse } from '../interfaces/pagination.interface';

/**
 * @class PaginationQueryDto
 * @description This class is responsible for handling pagination query parameters.
 * It provides a way to validate and transform the query parameters.
 */

export class PaginationQueryDto {
  /**
   * @description
   * The position of the page number that you want the API to return
   */
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 1,
    description:
      'The position of the page number that you want the API to return',
    type: 'number',
    example: 1,
  })
  page?: number;

  /**
   * @description
   * The number of entries returned per query
   */
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  @ApiPropertyOptional({
    default: 10,
    description: 'The number of entries returned per query',
    type: 'number',
    example: 10,
  })
  size?: number;
}

/**
 * @class PaginationResponseDto
 * @description This class is responsible for handling pagination response.
 * It provides a way to validate and transform the response data.
 */
export class PaginationResponseDto<T> implements PaginatedResponse<T> {
  /**
   * @description
   * The paginated property indicates whether the data is paginated or not.
   * this is not a part of the response
   * @type {boolean}
   */
  paginated: true;

  /**
   * @description
   * The data property contains the paginated data.
   * @type {T[]}
   */
  @ApiProperty({
    description: 'The data property contains the paginated data',
    type: 'array',
    items: { type: 'object' },
  })
  data: T[];

  /**
   * @description
   * The meta property contains information about the pagination.
   * @type {object}
   */
  @ApiProperty({
    description: 'The meta property contains information about the pagination',
    type: 'object',
    properties: {
      itemsPerPage: { type: 'number' },
      totalItems: { type: 'number' },
      currentPage: { type: 'number' },
      totalPages: { type: 'number' },
    },
  })
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };

  /**
   * @description
   * The links property contains information about the pagination links.
   * @type {object}
   */
  @ApiProperty({
    description:
      'The links property contains information about the pagination links',
    type: 'object',
    properties: {
      first: { type: 'string' },
      previous: { type: 'string' },
      current: { type: 'string' },
      next: { type: 'string' },
      last: { type: 'string' },
    },
  })
  links: {
    first: string;
    previous: string | null;
    current: string | null;
    next: string | null;
    last: string;
  };
}
