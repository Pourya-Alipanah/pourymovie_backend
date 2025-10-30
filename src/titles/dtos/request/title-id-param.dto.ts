import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

/**
 * DTO used to extract the title ID from route parameters.
 */
export class TitleIdParamDto {
  /**
   * The ID of the title.
   */
  @ApiProperty({
    description: 'The ID of the title',
    type: Number,
    example: 42,
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id: number;
}
