import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';
import { Genre } from '../helper/genre.dto';

/**
 * Data Transfer Object for the response of a genre request.
 * This class extends the Genre class to include all properties
 */
export class GetGenreResponseDto extends Genre {}

/**
 * Data Transfer Object for the response of a paginated genre request.
 * It extends PaginationResponseDto with GetGenreResponseDto as the type parameter.
 */
export class GetPaginatedGenreResponseDto extends PaginationResponseDto<GetGenreResponseDto> {}
