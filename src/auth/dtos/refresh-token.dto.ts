import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Data Transfer Object for refreshing tokens.
 * @class RefreshTokenDto
 */
export class RefreshTokenDto {
  /**
   * The refresh token for the user.
   * @type {string}
   */
  @ApiProperty({
    description: 'The refresh token for the user',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
