import { Injectable } from '@nestjs/common';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationQueryDto } from './dtos/pagination.dto';
import { PaginatedResponse } from './interfaces/pagination.interface';
import { PaginationProvider } from './providers/pagination.provider';


/**
 * PaginationService
 * @description This service is responsible for handling pagination logic.
 * It provides a method to paginate data using TypeORM's SelectQueryBuilder.
 */
@Injectable()
export class PaginationService {

  /**
   * constructor
   * @param paginationProvider
   */
  constructor(
    private readonly paginationProvider: PaginationProvider,
  ) {}

  /**
   * paginated
   * @param page
   * @param size
   * @param queryBuilder
   */
  public async paginated<T extends ObjectLiteral , I>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationQuery?: PaginationQueryDto,
  ): Promise<PaginatedResponse<I>> {
    const { page = 1, size = 10 } = paginationQuery || {};
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

    return { data: data as unknown as I[], paginated: true, ...metaData };
  }
}
