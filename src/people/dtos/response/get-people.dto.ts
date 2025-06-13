import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';
import { PersonDto } from '../helper/person.dto';

export class GetPeopleRequestDto extends PaginationResponseDto<PersonDto> {}
