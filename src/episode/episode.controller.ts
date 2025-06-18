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

@Controller({ version: '1', path: 'episode' })
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @ApiOperation({
    summary: 'Get all episodes with season ID',
    description:
      'This endpoint retrieves all episodes associated with a specific season ID.',
  })
  @Get(':id')
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  @ApiSingleResponse(GetEpisodesResponseDto)
  getAllEpisodesWithSeasonId(@Param() { id }: GetByIdParamDto) {
    return this.episodeService.getAllEpisodesWithSeasonId(id);
  }

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
