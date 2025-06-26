import { PartialType } from '@nestjs/swagger';
import { CreateLanguageRequestDto } from './create-language.dto';

/**
 * This file is part of the "Language Management" project.
 * It defines the UpdateLanguageRequestDto class used for updating an existing language.
 */
export class UpdateLanguageRequestDto extends PartialType(
  CreateLanguageRequestDto,
) {}
