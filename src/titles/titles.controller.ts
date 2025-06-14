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
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { TitlesService } from './titles.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetTitleDetailsResponseDto } from './dtos/response/get-title-details.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/paginated-response.decorator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { CreateTitleDto } from './dtos/request/create-title.dto';
import { Role } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { UpdateTitleRequestDto } from './dtos/request/update-title.dto';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { GetBySlugParamDto } from 'src/common/dto/request/slug-param.dto';

/**
 * Controller for handling title-related endpoints.
 */
@ApiTags('Titles')
@Auth(AuthType.Bearer)
@Controller({ version: '1', path: 'titles' })
export class TitlesController {
  /**
   * Injects the TitlesService.
   * @param {TitlesService} titlesServise - Service for handling title operations
   */
  constructor(private readonly titlesServise: TitlesService) {}

  /**
   * Fetches details of a title by its Slug.
   * @param {GetTitleDetailsRequestDto} getTitleDetailsRequestDto - DTO containing the title ID
   * @returns {Promise<GetTitleDetailsResponseDto>} Details of the requested title
   */
  @ApiOperation({
    summary: 'Fetches details of a title by its Slug',
    description:
      'This endpoint retrieves the details of a title using its unique Slug.',
  })
  @Get('/:slug')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetTitleDetailsResponseDto)
  getTitleBySlug(@Param() { slug }: GetBySlugParamDto) {
    return this.titlesServise.findBySlug(slug);
  }

  /**
   * Fetches all titles with pagination.
   * @param {PaginationQueryDto} titlesQuery - Query parameters for pagination
   * @returns {Promise<GetTitleDetailsResponseDto>} Paginated list of titles
   */
  @ApiOperation({
    summary: 'Fetches all titles with pagination',
    description:
      'This endpoint retrieves a paginated list of all titles available in the system.',
  })
  @Get()
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(GetTitleDetailsResponseDto)
  getAllTitles(@Query() titlesQuery?: PaginationQueryDto) {
    return this.titlesServise.findAllTitles(titlesQuery);
  }

  /**
   * Deletes a title by its ID.
   * @param {GetByIdParamDto} id - DTO containing the title ID
   * @returns {Promise<void>} Confirmation of deletion
   */
  @ApiOperation({
    summary: 'Deletes a title by its ID',
    description:
      'This endpoint allows you to delete a title using its unique identifier.',
  })
  @Delete('/:id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Role(UserRole.ADMIN)
  deleteTitle(@Param() { id }: GetByIdParamDto) {
    return this.titlesServise.deleteTitleById(id);
  }

  /**
   * Creates a new title.
   * @param {CreateTitleDto} dto - DTO containing the details of the title to be created
   * @return {Promise<GetTitleDetailsResponseDto>} Details of the created title
   * @description This endpoint allows you to create a new title by providing the necessary details.
   */
  @Post()
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Creates a new title',
    description:
      'This endpoint allows you to create a new title by providing the necessary details.',
  })
  @ApiSingleResponse(GetTitleDetailsResponseDto)
  @Role(UserRole.ADMIN)
  createTitle(@Body() dto: CreateTitleDto) {
    return this.titlesServise.createTitle(dto);
  }

  /**
   * Updates an existing title.
   * @param {GetByIdParamDto} id - DTO containing the title ID
   * @param {UpdateTitleRequestDto} dto - DTO containing the updated details of the title
   * @return {Promise<GetTitleDetailsResponseDto>} Details of the updated title
   * @description This endpoint allows you to update an existing title by providing the necessary details.
   */
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Updates an existing title',
    description:
      'This endpoint allows you to update an existing title by providing the necessary details.',
  })
  @ApiSingleResponse(GetTitleDetailsResponseDto)
  @Role(UserRole.ADMIN)
  updateTitle(
    @Param() { id }: GetByIdParamDto,
    @Body() dto: UpdateTitleRequestDto,
  ) {
    return this.titlesServise.updateTitle(id, dto);
  }
}
