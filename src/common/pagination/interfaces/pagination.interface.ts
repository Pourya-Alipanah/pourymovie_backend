/**
 * @description
 * This interface represents the metadata for paginated data.
 */
export interface PaginatiedPageMetaData {
  /**
   * @description
   * The meta property contains information about the pagination.
   */
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  /**
   * @description
   * The links property contains information about the pagination links.
   */
  links: {
    first: string;
    previous: string | null;
    current: string | null;
    next: string | null;
    last: string;
  };
}

/**
 * @description
 * This interface represents the paginated data.
 * It extends the PaginatiedPageMetaData interface.
 */
export interface Paginated<T> extends PaginatiedPageMetaData {
  /**
   * @description
   * The data property contains the paginated data.
   */
  data: T[];
}


/**
 * @description
 * This interface represents the paginated response.
 * It extends the Paginated interface.
 */
export interface PaginatedResponse<T> extends Paginated<T> {
  /**
   * @description
   * The paginated property indicates whether the data is paginated or not.
   */
  paginated: true;
}
