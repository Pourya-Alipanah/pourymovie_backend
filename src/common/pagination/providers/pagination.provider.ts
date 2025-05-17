import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PaginationQueryDto } from '../dtos/pagination.dto';
import { PaginatiedPageMetaData } from '../interfaces/pagination.interface';

@Injectable({ scope: Scope.REQUEST })export class PaginationProvider {
  constructor(
    /**
     * inject request
     */
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  /**
   * build meta link
   * @param page number
   * @param size number
   * @returns string of meta link
   */
  private metaLinkBuilder({
    page,
    size,
  }: Required<PaginationQueryDto>): string {
    /**
     * create request url
     */
    const baseURL = `${this.request.protocol}://${this.request.get('host')}/`;
    const requestURL = new URL(this.request.url, baseURL);
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    /**
     * build and return the link
     */
    return `${requestURL.origin}${requestURL.pathname}?${params.toString()}`;
  }

  /**
   * build meta data
   * @param page number
   * @param size number
   * @param total number
   * @returns object of meta data for pagination
   */
  public metaDataBuilder({
    page,
    size,
    total,
  }: Required<PaginationQueryDto> & {
    total: number;
  }): PaginatiedPageMetaData {
    /**
     * calculate total pages
     */
    const totalPages = Math.ceil(total / size);
    return {
      meta: {
        itemsPerPage: size,
        totalItems: total,
        currentPage: page,
        totalPages,
      },
      links: {
        first: this.metaLinkBuilder({ page: 1, size }),
        previous:
          page > 1 ? this.metaLinkBuilder({ page: page - 1, size }) : null,
        current: this.metaLinkBuilder({ page, size }),
        next:
          page < totalPages
            ? this.metaLinkBuilder({ page: page + 1, size })
            : null,
        last: this.metaLinkBuilder({ page: totalPages, size }),
      },
    };
  }
}
