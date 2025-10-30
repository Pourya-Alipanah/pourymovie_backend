import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for authentication response
 * @class AuthResponseDto
 * @description Dto for a single response without pagination , manipulated by interceptor.
 */
export class SingleResponseDto<T> {
  /**
   * @description
   * The data property contains the single data object.
   * @type {T}
   * @template T
   * @version 1
   */
  @ApiProperty({
    description: 'The data property contains the single data object',
  })
  data: T;
}
