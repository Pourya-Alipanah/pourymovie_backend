import { PartialType } from '@nestjs/swagger';
import { CreateEpisodeRequestDto } from './create-episode.dto';

/**
 * Data Transfer Object for updating an existing episode.
 * This DTO extends the CreateEpisodeRequestDto to allow partial updates.
 */
export class UpdateEpisodeRequestDto extends PartialType(
  CreateEpisodeRequestDto,
) {}
