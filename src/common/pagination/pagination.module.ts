import { Global, Module } from '@nestjs/common';
import { PaginationProvider } from './providers/pagination.provider';
import { PaginationService } from './pagination.service';


/**
 * PaginationModule
 * @description This module is responsible for handling pagination logic.
 * It provides a service and a provider to handle pagination.
 */
@Global()
@Module({
  providers: [PaginationProvider, PaginationService],
  exports: [PaginationService ,PaginationProvider],
})
export class PaginationModule {}
