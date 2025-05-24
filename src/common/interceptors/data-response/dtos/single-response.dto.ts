import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Dto for a single response without pagination , manipulated by interceptor.
 */
export class SingleResponseDto<T> {
  /**
   * @description
   * The data property contains the single data object.
   * @type {T}
   */
  @ApiProperty({
    description: 'The data property contains the single data object',
  })
  data: T;
}
