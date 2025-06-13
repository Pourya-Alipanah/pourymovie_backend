import { PartialType } from '@nestjs/swagger';
import { CreateTitleDto } from './create-title.dto';

/**
 * Data Transfer Object for updating a title.
 * Extends the CreateTitleDto to allow partial updates.
 */
export class UpdateTitleRequestDto extends PartialType(CreateTitleDto) {}
