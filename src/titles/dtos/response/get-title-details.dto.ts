import { ApiProperty } from '@nestjs/swagger';
import { Comment } from 'src/comment/dtos/helper/comment.dto';
import { TitleDto } from '../helper/title.dto';

/**
 * DTO for returning detailed information about a title.
 * @typedef {Object} GetTitleDetailsResponseDto
 * @property {Comment[]} comments - Comments on the title
 */
export class GetTitleDetailsResponseDto extends TitleDto {
  /**
   * Comments on the title
   * @type {Comment[]}
   */
  @ApiProperty({
    description: 'Comments on the title',
    name: 'comments',
    isArray: true,
    type: Comment,
  })
  comments: Comment[];
}
