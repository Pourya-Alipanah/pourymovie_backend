export interface PaginatiedPageMetaData {
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
  };
  links: {
    first: string;
    previous: string | null;
    current: string | null;
    next: string | null;
    last: string;
  };
}

export interface Paginated<T> extends PaginatiedPageMetaData {
  data: T[];
}

export interface PaginatedResponse<T> extends Paginated<T> {
  paginated: true;
}
