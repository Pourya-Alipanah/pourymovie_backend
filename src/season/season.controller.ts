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
import { SeasonService } from './providers/season.service';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/user/enums/user-role.enum';
import { Role } from 'src/auth/decorators/role.decorator';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetSeasonsResponseDto } from './dtos/response/get-seasons.dto';
import { CreateSeasonRequestDto } from './dtos/request/create-season.dto';
import { UpdateSeasonRequestDto } from './dtos/request/update-season.dto';

/**
 * SeasonController is responsible for handling requests related to seasons.
 * It provides endpoints to create, update, delete, and retrieve seasons associated with titles.
 */
@ApiTags('Season')
@Controller({ version: '1', path: 'season' })
export class SeasonController {
  /**
   * Creates an instance of SeasonController.
   * @param {SeasonService} seasonService - The service used to manage seasons.
   */
  constructor(private readonly seasonService: SeasonService) {}

  /**
   * Retrieves all seasons associated with a specific title ID.
   * @param {GetByIdParamDto} id - The ID of the title for which to retrieve seasons.
   * @returns {Promise<GetSeasonsResponseDto>} A promise that resolves to an array of seasons.
   */
  @ApiOperation({
    summary: 'Get all seasons with title ID',
    description:
      'This endpoint retrieves all seasons associated with a specific title ID.',
  })
  @Get(':id')
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  @ApiSingleResponse(GetSeasonsResponseDto)
  getAllSeasonsWithTitleId(@Param() { id }: GetByIdParamDto) {
    return this.seasonService.getAllSeasonsWithTitleId(id);
  }

  /**
   * Deletes a season by its ID.
   * @param {GetByIdParamDto} id - The ID of the season to delete.
   * @returns {Promise<void>} A promise that resolves when the season is deleted.
   */
  @ApiOperation({
    summary: 'Delete a season by ID',
    description: 'This endpoint deletes a season using its unique ID.',
  })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Role(UserRole.ADMIN)
  deleteSeason(@Param() { id }: GetByIdParamDto) {
    return this.seasonService.deleteSeason(id);
  }

  /**
   * Creates a new season.
   * @param {CreateSeasonRequestDto} createSeasonRequestDto - The request DTO containing the details of the season to create.
   * @returns {Promise<GetSeasonsResponseDto>} A promise that resolves to the created season.
   */
  @Post()
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  @ApiSingleResponse(GetSeasonsResponseDto)
  createSeason(@Body() createSeasonRequestDto: CreateSeasonRequestDto) {
    return this.seasonService.createSeason(createSeasonRequestDto);
  }

  /**
   * Updates an existing season by its ID.
   * @param {GetByIdParamDto} id - The ID of the season to update.
   * @param {UpdateSeasonRequestDto} updateSeasonRequestDto - The request DTO containing the updated details of the season.
   * @returns {Promise<GetSeasonsResponseDto>} A promise that resolves to the updated season.
   */
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  @ApiSingleResponse(GetSeasonsResponseDto)
  updateSeason(
    @Param() { id }: GetByIdParamDto,
    @Body() updateSeasonRequestDto: UpdateSeasonRequestDto,
  ) {
    return this.seasonService.updateSeason(id, updateSeasonRequestDto);
  }
}
