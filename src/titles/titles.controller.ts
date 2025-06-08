import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { TitleIdParamDto } from './dtos/request/title-id-param.dto';
import { CreateTitleDto } from './dtos/request/create-title.dto';

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
   * Fetches details of a title by its ID.
   * @param {GetTitleDetailsRequestDto} getTitleDetailsRequestDto - DTO containing the title ID
   * @returns {Promise<GetTitleDetailsResponseDto>} Details of the requested title
   */
  @ApiOperation({
    summary: 'Fetches details of a title by its ID',
    description:
      'This endpoint retrieves the details of a title using its unique identifier.',
  })
  @Get('/:id')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetTitleDetailsResponseDto)
  getTitleById(@Param() { id }: TitleIdParamDto) {
    return this.titlesServise.findById(id);
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
   * @param {TitleIdParamDto} id - DTO containing the title ID
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
  deleteTitle(@Param() { id }: TitleIdParamDto) {
    return this.titlesServise.deleteTitleById(id);
  }

  @Post()
  // @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ایجاد عنوان جدید' })
  @ApiSingleResponse(GetTitleDetailsResponseDto)
  @Auth(AuthType.None)
  createTitle(@Body() dto: CreateTitleDto) {
    return this.titlesServise.createTitle(dto);
  }
}
