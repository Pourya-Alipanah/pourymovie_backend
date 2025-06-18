import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { EpisodeService } from './providers/episode.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from 'src/user/enums/user-role.enum';
import { Role } from 'src/auth/decorators/role.decorator';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { GetEpisodesResponseDto } from './dtos/response/get-episodes.dto';

@Controller({ version: '1', path: 'episode' })
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @ApiOperation({
    summary: 'Get all episodes with title ID',
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
    summary: 'Delete a episode by ID',
    description: 'This endpoint deletes a episode using its unique ID.',
  })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Role(UserRole.ADMIN)
  deleteEpisode(@Param() { id }: GetByIdParamDto) {
    return this.episodeService.deleteEpisode(id);
  }
}
