import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';
import { PersonDto } from '../helper/person.dto';

/**
 * Data Transfer Object for paginated response of people.
 * This DTO extends the PaginationResponseDto with PersonDto as the type parameter.
 * It is used to return a list of people with pagination information.
 */
export class GetPeopleRequestDto extends PaginationResponseDto<PersonDto> {}
