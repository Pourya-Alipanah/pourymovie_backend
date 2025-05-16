import { Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination.provider';
import { PaginationService } from './pagination.service';

@Module({
  providers: [PaginationProvider, PaginationService],
  exports: [PaginationService],
})
export class PaginationModule {}
