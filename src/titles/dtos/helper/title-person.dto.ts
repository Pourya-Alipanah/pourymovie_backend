import { ApiProperty } from '@nestjs/swagger';
import { PersonRole } from 'src/people/enums/person-role.enum';
import { TitleSummaryDto } from './title-summary.dto';

/**
 * Data Transfer Object representing the relationship between a title and a person.
 * This DTO includes the unique identifier for the relationship, the role of the person,
 * and the associated title.
 */
export class TitlePersonDto {
  /**
   * Unique identifier for the title-person relationship
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the title-person relationship',
    name: 'id',
    type: 'number',
    required: true,
  })
  id: number;

  /**
   * Role of the person in the title (e.g., Actor, Director)
   * @type {UserRole}
   */
  @ApiProperty({
    description: 'Role of the person in the title',
    name: 'role',
    enum: PersonRole,
    required: true,
  })
  role: PersonRole;

  /**
   * title associated with the person
   * @type {Object}
   */
  @ApiProperty({
    description: 'List of titles associated with the person',
    type: [TitleSummaryDto],
    nullable: true,
  })
  title: TitleSummaryDto;
}
