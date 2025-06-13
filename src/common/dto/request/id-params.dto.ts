import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class GetByIdParamDto {
  /**
   * Unique identifier of the entity to be fetched
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier of the entity to be fetched',
    name: 'id',
    type: 'number',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id: number;
}
