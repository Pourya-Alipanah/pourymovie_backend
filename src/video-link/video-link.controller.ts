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
} from '@nestjs/common';
import { VideoLinkService } from './providers/video-link.service';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetVideoLinkResponseDto } from './dtos/response/get-video-link.dto';
import { CreateVideoLinkRequestDto } from './dtos/request/create-video-link.dto';
import { Role } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { CreateMultipleVideoLinkRequestDto } from './dtos/request/create-multiple-video-link.dto';
import { UpdateVideoLinkRequestDto } from './dtos/request/update-video-link.dto';

/**
 * Controller for managing video links.
 * Provides endpoints to create, update, retrieve, and delete video links associated with titles or episodes.
 */
@Controller({ path: 'video-link', version: '1' })
export class VideoLinkController {
  /**
   * Creates an instance of VideoLinkController.
   * @param videoLinkService - Service for managing video links.
   */
  constructor(private readonly videoLinkService: VideoLinkService) {}

  /**
   * Fetches a video link by its ID.
   * @param {GetByIdParamDto} id - The ID of the video link to retrieve.
   * @return {Promise<GetVideoLinkResponseDto>} The video link associated with the provided ID.
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get video link by episode ID',
    description:
      'Fetches the video link associated with a specific episode ID.',
  })
  @Get('by-episode/:id')
  @ApiSingleResponse(GetVideoLinkResponseDto, true)
  async getVideoLinkByEpisode(@Param() { id }: GetByIdParamDto) {
    return this.videoLinkService.getByEpisodeId(id);
  }

  /**
   * Fetches a video link by its title ID.
   * @param {GetByIdParamDto} id - The ID of the title to retrieve the video link for.
   * @return {Promise<GetVideoLinkResponseDto>} The video link associated with the provided title ID.
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Get video link by title ID',
    description: 'Fetches the video link associated with a specific title ID.',
  })
  @Get('by-title/:id')
  @ApiSingleResponse(GetVideoLinkResponseDto, true)
  async getVideoLinkByTitle(@Param() { id }: GetByIdParamDto) {
    return this.videoLinkService.getByTitleId(id);
  }

  /**
   * Retrieves a video link by its ID.
   * @param {GetByIdParamDto} id - The ID of the video link to retrieve.
   * @return {Promise<GetVideoLinkResponseDto>} The video link associated with the provided ID.
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create a new video link',
    description: 'Creates a new video link with the provided details.',
  })
  @ApiSingleResponse(GetVideoLinkResponseDto)
  @Role(UserRole.ADMIN)
  @Post()
  async createVideoLink(
    @Body() createVideoLinkRequestDto: CreateVideoLinkRequestDto,
  ) {
    return this.videoLinkService.create(createVideoLinkRequestDto);
  }

  /**
   * Creates multiple video links in a single request.
   * @param {CreateMultipleVideoLinkRequestDto} createMultipleVideoLinkRequestDto - The request DTO containing multiple video link details.
   * @return {Promise<GetVideoLinkResponseDto[]>} An array of created video links.
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create multiple video links',
    description:
      'Creates multiple video links with the provided details in a single request.',
  })
  @ApiSingleResponse(GetVideoLinkResponseDto, true)
  @Role(UserRole.ADMIN)
  @Post('/multi')
  async createMultiVideoLink(
    @Body()
    createMultipleVideoLinkRequestDto: CreateMultipleVideoLinkRequestDto,
  ) {
    return this.videoLinkService.createMulti(createMultipleVideoLinkRequestDto);
  }

  /**
   * Updates an existing video link by its ID.
   * @param {GetByIdParamDto} id - The ID of the video link to update.
   * @param {UpdateVideoLinkRequestDto} updateVideoLinkRequestDto - The request DTO containing updated video link details.
   * @return {Promise<GetVideoLinkResponseDto>} The updated video link.
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Update an existing video link',
    description: 'Updates the details of an existing video link by its ID.',
  })
  @ApiSingleResponse(GetVideoLinkResponseDto)
  @Role(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param() { id }: GetByIdParamDto,
    @Body()
    updateVideoLinkRequestDto: UpdateVideoLinkRequestDto,
  ) {
    return this.videoLinkService.update(updateVideoLinkRequestDto, id);
  }

  /**
   * Deletes a video link by its ID.
   * @param {GetByIdParamDto} id - The ID of the video link to delete.
   * @return {Promise<void>} A promise that resolves when the video link is deleted.
   */
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete a video link',
    description: 'Deletes a video link by its ID.',
  })
  @Role(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() { id }: GetByIdParamDto) {
    return this.videoLinkService.delete(id);
  }
}
