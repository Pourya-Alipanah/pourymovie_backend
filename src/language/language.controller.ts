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
import { LanguageService } from './providers/language.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/decorators/paginated-response.decorator';
import {
  GetLanguagesPaginatedResponseDto,
  GetLanguagesResponseDto,
} from './dtos/response/get-languages.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { GetBySlugParamDto } from 'src/common/dto/request/slug-param.dto';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { CreateLanguageRequestDto } from './dtos/request/create-language.dto';
import { UpdateLanguageRequestDto } from './dtos/request/update-language.dto';
import { GetByIdParamDto } from 'src/common/dto/request/id-params.dto';

/**
 * This file is part of the "Language Management" project.
 * It defines the LanguageController class, which handles HTTP requests related to language operations.
 */
@Controller({ version: '1', path: 'language' })
export class LanguageController {
  /**
   * Creates an instance of LanguageController.
   * @param languageService - The service responsible for handling language-related operations.
   */
  constructor(private readonly languageService: LanguageService) {}

  /**
   * Retrieves all languages with optional pagination.
   * @param languagesQuery - Optional query parameters for pagination.
   * @returns A paginated list of languages.
   */
  @ApiOperation({
    summary: 'Get all languages',
    description:
      'Retrieve a paginated list of all languages available in the system.',
  })
  @Get()
  @ApiBearerAuth('access-token')
  @ApiPaginatedResponse(GetLanguagesResponseDto)
  getAllLanguages(@Query() languagesQuery?: PaginationQueryDto) {
    return this.languageService.getAllLanguages(languagesQuery);
  }

  /**
   * Retrieves a language by its unique slug identifier.
   * @param slug - The unique slug of the language to retrieve.
   */
  @ApiOperation({
    summary: 'Get language by slug',
    description: 'Retrieve a language by its unique slug identifier.',
  })
  @Get(':slug')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetLanguagesResponseDto)
  getLanguageBySlug(@Param() { slug }: GetBySlugParamDto) {
    return this.languageService.getBySlug(slug);
  }

  /**
   * Retrieves a language by its unique identifier.
   * @param id - The unique identifier of the language to retrieve.
   */
  @ApiOperation({
    summary: 'Create a new language',
    description: 'Add a new language to the system with the provided details.',
  })
  @Post()
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetLanguagesResponseDto)
  createLanguage(@Body() dto: CreateLanguageRequestDto) {
    return this.languageService.create(dto);
  }

  /**
   * Updates an existing language by its unique identifier.
   * @param id - The unique identifier of the language to update.
   * @param dto - The updated details of the language.
   */
  @ApiOperation({
    summary: 'Update an existing language',
    description:
      'Update the details of an existing language using its unique identifier.',
  })
  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetLanguagesResponseDto)
  updateLanguage(
    @Param() { id }: GetByIdParamDto,
    @Body() dto: UpdateLanguageRequestDto,
  ) {
    return this.languageService.update(id, dto);
  }

  /**
   * Deletes a language by its unique identifier.
   * @param id - The unique identifier of the language to delete.
   */
  @ApiOperation({
    summary: 'Delete a language',
    description:
      'Remove a language from the system using its unique identifier.',
  })
  @Delete(':id')
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteLanguage(@Param() { id }: GetByIdParamDto) {
    return this.languageService.delete(id);
  }
}
