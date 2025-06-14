import { TitlePersonDto } from 'src/titles/dtos/helper/title-person.dto';
import { PersonDto } from '../helper/person.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for the response of a single person.
 * This DTO extends the PersonDto and includes additional properties
 * such as a list of titles associated with the person.
 */
export class GetPersonResponseDto extends PersonDto {
  /**
   * List of titles associated with the person
   * @type {TitlePersonDto[]}
   */
  @ApiProperty({
    description: 'List of titles associated with the person',
    type: [TitlePersonDto],
    nullable: true,
  })
  titlePersons: TitlePersonDto[] | null;
}
