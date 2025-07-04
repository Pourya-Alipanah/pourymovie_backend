import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from '../comment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { GetCommentResponseDto } from '../dtos/response/get-comment.dto';
import { TitlesService } from 'src/titles/titles.service';
import { CreateCommentRequestDto } from '../dtos/request/create-comment.dto';
import { UpdateCommentRequestDto } from '../dtos/request/update-comment.dto';
import {
  COMMENT_NOT_FOUND_ERROR,
  FORBIDDEN_TO_DELETE_COMMENT_ERROR,
} from '../constants/comment.errors.constants';
import { UserRole } from 'src/user/enums/user-role.enum';
import { DeletedBy } from '../enums/deleted-by.enum';

/**
 * Service for managing comments.
 * This service provides methods to create, update, delete, and retrieve comments.
 * It handles pagination and ensures that users can only delete their own comments unless they are a super admin.
 */
@Injectable()
export class CommentService {
  /**
   * Creates an instance of CommentService.
   * @param commentRepository - The repository for managing comments.
   * @param paginationService - The service for handling pagination.
   * @param titlesService - The service for managing titles.
   */
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly paginationService: PaginationService,
    private readonly titlesService: TitlesService,
  ) {}

  /**
   * Retrieves all comments for a specific title.
   * @param titleId - The ID of the title for which to retrieve comments.
   * @param params - Optional pagination parameters.
   * @returns A paginated response containing comments for the specified title.
   */
  public async getAllTitleComments(
    titleId: number,
    params?: PaginationQueryDto,
  ) {
    await this.titlesService.findById(titleId);
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .leftJoin('comment.user', 'user')
      .addSelect([
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.avatarUrl',
      ])
      .where('comment.title.id = :titleId', { titleId });

    return this.paginationService.paginated<Comment, GetCommentResponseDto>(
      queryBuilder,
      params,
    );
  }

  /**
   * Retrieves all comments made by a specific user.
   * @param userId - The ID of the user for whom to retrieve comments.
   * @param params - Optional pagination parameters.
   * @returns A paginated response containing comments made by the specified user.
   */
  public async getAllUserComments(userId: number, params?: PaginationQueryDto) {
    const queryBuilder = this.commentRepository
      .createQueryBuilder('comment')
      .select()
      .where('comment.user.id = :userId', { userId });

    return this.paginationService.paginated<Comment, GetCommentResponseDto>(
      queryBuilder,
      params,
    );
  }

  /**
   * Creates a new comment for a specific title.
   * @param dto - The data transfer object containing comment details.
   * @param userId - The ID of the user creating the comment.
   * @returns The created comment.
   */
  public async createComment(dto: CreateCommentRequestDto, userId: number) {
    await this.titlesService.findById(dto.titleId);
    const comment = this.commentRepository.create({
      ...dto,
      title: { id: dto.titleId },
      user: { id: userId },
    });

    return this.commentRepository.save(comment);
  }

  /**
   * Updates an existing comment by its ID.
   * @param dto - The data transfer object containing updated comment details.
   * @param commentId - The ID of the comment to update.
   * @returns The updated comment.
   */
  public async updateComment(dto: UpdateCommentRequestDto, commentId: number) {
    const comment = await this.commentRepository.findOneBy({ id: commentId });
    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_ERROR);
    }
    Object.assign(comment, dto);

    return this.commentRepository.save(comment);
  }

  /**
   * Deletes a comment by its ID.
   * Only the user who created the comment or a super admin can delete it.
   * @param commentId - The ID of the comment to delete.
   * @param userId - The ID of the user attempting to delete the comment.
   * @param role - The role of the user (to check if they are a super admin).
   */
  public async deleteComment(
    commentId: number,
    userId: number,
    role: UserRole,
  ) {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_ERROR);
    }
    if (comment.user.id !== userId && role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(FORBIDDEN_TO_DELETE_COMMENT_ERROR);
    }
    await this.commentRepository.update(commentId, {
      deletedAt: new Date(),
      deletedBy: comment.user.id === userId ? DeletedBy.USER : DeletedBy.ADMIN,
    });
  }
}
