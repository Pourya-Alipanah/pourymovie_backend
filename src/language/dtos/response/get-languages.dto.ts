import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';
import { Language } from '../helper/language.dto';
/**
 * This file is part of the "Title Management" project.
 * It defines the GetLanguagesResponseDto class used to represent the response for getting languages.
 */
export class GetLanguagesResponseDto extends Language {}

/**
 * This file is part of the "Title Management" project.
 * It defines the GetLanguagesPaginatedResponseDto class used to represent a paginated response for getting languages.
 */
export class GetLanguagesPaginatedResponseDto extends PaginationResponseDto<GetLanguagesResponseDto> {}
