import { PaginationResponseDto } from 'src/common/pagination/dtos/pagination.dto';
import { Comment } from '../helper/comment.dto';

/**
 * DTO for representing a comment response.
 */
export class GetCommentResponseDto extends Comment {}

/**
 * DTO for representing a paginated response of comments.
 */
export class GetPaginatedCommentsResponseDto extends PaginationResponseDto<Comment> {}
