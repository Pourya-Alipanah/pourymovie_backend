import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for authentication response
 * @class AuthResponseDto
 */
export class AuthResponseDto {
  /**
   * The access token for the user
   * @type {string}
   */
  @ApiProperty({
    description: 'The access token for the user',
  })
  accessToken: string;
}
