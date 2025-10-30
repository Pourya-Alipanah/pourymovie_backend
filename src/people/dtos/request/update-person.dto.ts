import { PartialType } from '@nestjs/swagger';
import { CreatePersonRequestDto } from './create-person.dto';

/**
 * Data Transfer Object for updating an existing person.
 * This DTO extends the CreatePersonRequestDto
 * and allows for partial updates to the person's properties.
 */
export class UpdatePersonRequestDto extends PartialType(
  CreatePersonRequestDto,
) {}
