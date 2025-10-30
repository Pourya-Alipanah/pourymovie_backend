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
import { GenreService } from './providers/genre.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { GetGenreResponseDto } from './dtos/response/get-genre.dto';
import { ApiPaginatedResponse } from 'src/common/decorators/paginated-response.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { GetBySlugParamDto } from 'src/common/dto/request/slug-param.dto';
import { CreateGenreRequestDto } from './dtos/request/create-genre.dto';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';
import { UpdateGenreRequestDto } from './dtos/request/update-genre.dto';

/**
 * Controller for managing genres.
 * Handles requests related to genres, including creating, updating, retrieving, and deleting genres.
 */
@Controller({ version: '1', path: 'genre' })
export class GenreController {
  /**
   * Creates an instance of GenreController.
   * @param genreService - The service responsible for handling genre-related operations.
   */
  constructor(private readonly genreService: GenreService) {}

  /**
   * Retrieves all genres with optional pagination.
   * @param paginationQueryDto - Optional query parameters for pagination.
   * @returns A paginated list of genres.
   */
  @ApiOperation({
    summary: 'Get all genres',
    description:
      'Retrieve a paginated list of all genres available in the system.',
  })
  @Get()
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(GetGenreResponseDto)
  getAllGenres(@Query() paginationQueryDto?: PaginationQueryDto) {
    return this.genreService.findAll(paginationQueryDto);
  }

  /**
   * Retrieves a genre by its unique slug identifier.
   * @param slug - The unique slug of the genre to retrieve.
   * @returns The genre entity if found.
   */
  @ApiOperation({
    summary: 'Get genre by slug',
    description: 'Retrieve a genre by its unique slug identifier.',
  })
  @Get(':slug')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetGenreResponseDto)
  getGenreBySlug(@Param() { slug }: GetBySlugParamDto) {
    return this.genreService.getBySlug(slug);
  }

  /**
   * Creates a new genre with the provided details.
   * @param createGenreDto - The details of the genre to create.
   * @return The created genre entity.
   */
  @ApiOperation({
    summary: 'Create a new genre',
    description: 'Create a new genre with the provided details.',
  })
  @Post()
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetGenreResponseDto)
  createGenre(@Body() createGenreDto: CreateGenreRequestDto) {
    return this.genreService.create(createGenreDto);
  }

  /**
   * Updates an existing genre by its unique identifier.
   * @param id - The unique identifier of the genre to update.
   * @param updateGenreRequestDto - The updated details of the genre.
   * @returns The updated genre entity.
   */
  @ApiOperation({
    summary: 'Get genre by ID',
    description: 'Retrieve a genre by its unique ID.',
  })
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetGenreResponseDto)
  updateGenre(
    @Param() { id }: GetByIdParamDto,
    @Body() updateGenreRequestDto: UpdateGenreRequestDto,
  ) {
    return this.genreService.update(id, updateGenreRequestDto);
  }

  /**
   * Deletes a genre by its unique identifier.
   * @param id - The unique identifier of the genre to delete.
   * @returns The deleted genre entity.
   */
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetGenreResponseDto)
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteGenre(@Param() { id }: GetByIdParamDto) {
    return this.genreService.delete(id);
  }
}
