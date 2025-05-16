import { SetMetadata } from '@nestjs/common';

export const Pagination = (...args: string[]) => SetMetadata('pagination', args);
