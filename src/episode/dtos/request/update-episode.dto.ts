import { PartialType } from '@nestjs/swagger';
import { CreateEpisodeRequestDto } from './create-episode.dto';

export class UpdateEpisodeRequestDto extends PartialType(
  CreateEpisodeRequestDto,
) {}
