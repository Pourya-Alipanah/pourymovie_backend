import { PartialType } from '@nestjs/swagger';
import { CreateGenreRequestDto } from './create-genre.dto';

/**
 * Data Transfer Object (DTO) for updating an existing genre.
 * This class extends CreateGenreRequestDto to inherit its properties,
 */
export class UpdateGenreRequestDto extends PartialType(CreateGenreRequestDto) {}
