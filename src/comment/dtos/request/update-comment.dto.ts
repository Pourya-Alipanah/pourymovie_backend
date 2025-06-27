import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCommentRequestDto } from './create-comment.dto';

/**
 * DTO for updating a comment request.
 */
export class UpdateCommentRequestDto extends OmitType(
  PartialType(CreateCommentRequestDto),
  ['titleId'],
) {}
