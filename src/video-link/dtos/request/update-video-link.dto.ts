import { PartialType } from '@nestjs/swagger';
import { CreateVideoLinkRequestDto } from './create-video-link.dto';

/**
 * DTO for updating a video link.
 * This class extends the CreateVideoLinkRequestDto to allow partial updates.
 * It inherits all properties from CreateVideoLinkRequestDto,
 * allowing any of them to be optional.
 * @typedef {Partial<CreateVideoLinkRequestDto>} UpdateVideoLinkRequestDtoq
 * @class UpdateVideoLinkRequestDto
 */
export class UpdateVideoLinkRequestDto extends PartialType(
  CreateVideoLinkRequestDto,
) {}
