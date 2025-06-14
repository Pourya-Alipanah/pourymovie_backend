import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, Min } from 'class-validator';
import { PersonRole } from 'src/people/enums/person-role.enum';

export class CreateTitlePersonRequestDto {
  /** ID of the person */
  @ApiProperty({
    example: 1,
    description: 'ID of the person',
    required: true,
  })
  @IsInt()
  @Min(1)
  id: number;

  /** Role of the person in the title (e.g., actor, director, writer) */
  @ApiProperty({
    example: 'actor',
    description:
      'Role of the person in the title (e.g., actor, director, writer)',
    enum: PersonRole,
    required: true,
  })
  @IsEnum(PersonRole)
  role: PersonRole;
}
