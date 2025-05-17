import { Injectable } from '@nestjs/common';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from './dtos/pagination.dto';
import { PaginatedResponse } from './interfaces/pagination.interface';
import { PaginationProvider } from './providers/pagination.provider';

@Injectable()
export class PaginationService {
  constructor(
    /**
     * inject pagination provider
     */
    private readonly paginationProvider: PaginationProvider,
  ) {}

  public async paginated<T extends ObjectLiteral>(
    { page = 1, size = 10 }: PaginationQueryDto,
    queryBuilder: SelectQueryBuilder<T>,
  ): Promise<PaginatedResponse<T>> {
    /**
     * build the query
     * and get the total count
     */
    const [data, total] = await queryBuilder
      .take(size)
      .skip((page - 1) * size)
      .getManyAndCount();

    /**
     * build the meta data
     */
    const metaData = this.paginationProvider.metaDataBuilder({
      page,
      size,
      total,
    });

    return { data, paginated: true, ...metaData };
  }
}
