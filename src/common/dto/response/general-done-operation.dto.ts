import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for the response after creating an admin user.
 * @class GeneralDoneOperationResponseDto
 * @description Data Transfer Object for the response returned when an General execution is done.
 * @property {Date} timeStamp - Timestamp of the operation.
 * @property {string} message - Message indicating the result of the operation.
 */
export class GeneralDoneOperationResponseDto {
  /**
   * times stamp of done operation
   * @type {Date}
   */
  @ApiProperty({ description: 'times stamp of done operation' })
  timestamp: Date;
  /**
   * message of done operation
   * @type {string}
   */
  @ApiProperty({ description: 'message of done operation' })
  message: string;
}
