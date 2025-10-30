import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CommentService } from './providers/comment.service';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/paginated-response.decorator';
import { GetCommentResponseDto } from './dtos/response/get-comment.dto';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { CreateCommentRequestDto } from './dtos/request/create-comment.dto';
import { UpdateCommentRequestDto } from './dtos/request/update-comment.dto';

/**
 * Controller for managing comments.
 * This controller provides endpoints to create, update, delete, and retrieve comments.
 * It handles pagination and ensures that users can only delete their own comments unless they are a super admin.
 */
@Controller({ version: '1', path: 'comment' })
export class CommentController {
  /**
   * Creates an instance of CommentController.
   * @param commentService - The service for managing comments.
   */
  constructor(private readonly commentService: CommentService) {}

  /**
   * Retrieves all comments for the current user.
   * @param activeUser - The active user data containing user ID.
   * @param paginationQuery - Optional pagination parameters.
   * @returns A paginated response containing comments made by the current user.
   */
  @ApiOperation({
    summary: 'Get all comments for current User',
    description: 'Fetches all comments associated with current User.',
  })
  @Get()
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(GetCommentResponseDto)
  getUserComments(
    @ActiveUser() { sub }: ActiveUserData,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.commentService.getAllUserComments(sub, paginationQuery);
  }

  /**
   * Retrieves all comments for a specific title.
   * @param paginationQuery - Optional pagination parameters.
   * @param id - The ID of the title for which to retrieve comments.
   * @returns A paginated response containing comments for the specified title.
   */
  @ApiOperation({
    summary: 'Get all comments for a specific title',
    description: 'Fetches all comments associated with a specific title ID.',
  })
  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(GetCommentResponseDto)
  getTitleComments(
    @Query() paginationQuery: PaginationQueryDto,
    @Param() { id }: GetByIdParamDto,
  ) {
    return this.commentService.getAllTitleComments(id, paginationQuery);
  }

  /**
   * Creates a new comment for a specific title.
   * @param dto - The data transfer object containing comment details.
   * @param activeUser - The active user data containing user ID.
   * @returns The created comment.
   */
  @ApiOperation({
    summary: 'Create a new comment',
    description: 'Creates a new comment for a specific title.',
  })
  @Post()
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetCommentResponseDto)
  createComment(
    @Body() dto: CreateCommentRequestDto,
    @ActiveUser() { sub }: ActiveUserData,
  ) {
    return this.commentService.createComment(dto, sub);
  }

  /**
   * Updates an existing comment by its ID.
   * @param dto - The data transfer object containing updated comment details.
   * @param id - The ID of the comment to update.
   * @returns The updated comment.
   */
  @ApiOperation({
    summary: 'Update an existing comment',
    description: 'Updates an existing comment by its ID.',
  })
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetCommentResponseDto)
  updateComment(
    @Body() dto: UpdateCommentRequestDto,
    @Param() { id }: GetByIdParamDto,
  ) {
    return this.commentService.updateComment(dto, id);
  }

  /**
   * Deletes a comment by its ID.
   * Note that only the user who created the comment and super admins can delete it.
   * @param id - The ID of the comment to delete.
   * @param activeUser - The active user data containing user ID and role.
   * @return A no content response if the deletion is successful.
   */
  @ApiOperation({
    summary: 'Delete a comment',
    description:
      'Deletes a comment by its ID. note that just user who created the comment and superAdmin can delete it.',
  })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteComment(
    @Param() { id }: GetByIdParamDto,
    @ActiveUser() { sub, role }: ActiveUserData,
  ) {
    return this.commentService.deleteComment(id, sub, role);
  }
}
