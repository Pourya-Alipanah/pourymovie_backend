import { PartialType } from '@nestjs/swagger';
import { CreateSeasonRequestDto } from './create-season.dto';

/**
 * This file is part of the "Season Management" project.
 * It defines the UpdateSeasonRequestDto used to update an existing season.
 */
export class UpdateSeasonRequestDto extends PartialType(
  CreateSeasonRequestDto,
) {}
