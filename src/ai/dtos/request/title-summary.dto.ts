import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * TitleSummaryDto is a Data Transfer Object (DTO) used to request a summary of a movie title.
 * It contains the name of the title for which the summary is requested.
 */
export class TitleSummaryRequestDto {
  /**
   * The name of the title for which the summary is requested.
   */
  @ApiProperty({
    description: 'The name of the title for which the summary is requested.',
    example: 'Inception',
    type: String,
    required: true,
    minLength: 1,
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}