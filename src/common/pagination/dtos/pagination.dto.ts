import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
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
