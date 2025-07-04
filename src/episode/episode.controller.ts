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
import { EpisodeService } from './providers/episode.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from 'src/user/enums/user-role.enum';
import { Role } from 'src/auth/decorators/role.decorator';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { GetEpisodesResponseDto } from './dtos/response/get-episodes.dto';
import { CreateEpisodeRequestDto } from './dtos/request/create-episode.dto';
import { UpdateEpisodeRequestDto } from './dtos/request/update-episode.dto';

/**
 * Controller for managing episodes in the application.
 * Provides endpoints to create, update, delete, and retrieve episodes.
 */
@Controller({ version: '1', path: 'episode' })
export class EpisodeController {
  /**
   * Initializes the EpisodeController with the EpisodeService.
   * @param episodeService - The service responsible for episode operations.
   */
  constructor(private readonly episodeService: EpisodeService) {}

  /**
   * Retrieves all episodes associated with a specific season ID.
   * @param id - The unique identifier of the season.
   * @returns A list of episodes for the specified season.
   */
  @ApiOperation({
    summary: 'Get all episodes with season ID',
    description:
      'This endpoint retrieves all episodes associated with a specific season ID.',
  })
  @Get(':id')
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  @ApiSingleResponse(GetEpisodesResponseDto, true)
  getAllEpisodesWithSeasonId(@Param() { id }: GetByIdParamDto) {
    return this.episodeService.getAllEpisodesWithSeasonId(id);
  }

  /**
   * Deletes an episode by its unique ID.
   * @param id - The unique identifier of the episode to be deleted.
   */
  @ApiOperation({
    summary: 'Delete an episode by ID',
    description: 'This endpoint deletes an episode using its unique ID.',
  })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Role(UserRole.ADMIN)
  deleteEpisode(@Param() { id }: GetByIdParamDto) {
    return this.episodeService.deleteEpisode(id);
  }

  /**
   * Creates a new episode.
   * This endpoint allows the creation of an episode with the provided details.
   */
  @ApiOperation({
    summary: 'Create an episode',
    description: 'This endpoint creates an episode.',
  })
  @Post()
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  @ApiSingleResponse(GetEpisodesResponseDto)
  createEpisode(@Body() createEpisodeRequestDto: CreateEpisodeRequestDto) {
    return this.episodeService.createEpisode(createEpisodeRequestDto);
  }

  /**
   * Updates an existing episode by its unique ID.
   * @param id - The unique identifier of the episode to be updated.
   * @param updateEpisodeRequestDto - The data to update the episode with.
   */
  @ApiOperation({
    summary: 'Update an episode by ID',
    description: 'This endpoint updates an episode using its unique ID.',
  })
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  @ApiSingleResponse(GetEpisodesResponseDto)
  updateEpisode(
    @Param() { id }: GetByIdParamDto,
    @Body() updateEpisodeRequestDto: UpdateEpisodeRequestDto,
  ) {
    return this.episodeService.updateEpisode(id, updateEpisodeRequestDto);
  }
}
