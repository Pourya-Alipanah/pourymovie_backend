import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from '../language.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from '../../common/pagination/pagination.service';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import {
  GetLanguagesPaginatedResponseDto,
  GetLanguagesResponseDto,
} from '../dtos/response/get-languages.dto';
import { NOT_FOUND_LANGUAGE_ERROR } from '../constants/language.errors.constans';
import { CreateLanguageRequestDto } from '../dtos/request/create-language.dto';
import slugify from 'slugify';
import { UpdateLanguageRequestDto } from '../dtos/request/update-language.dto';

/**
 * This file is part of the "Language Management" project.
 * It defines the LanguageService class, which provides methods for managing languages.
 * It includes methods for retrieving, creating, updating, and deleting languages,
 * as well as handling pagination for language lists.
 */
@Injectable()
export class LanguageService {
  /**
   * Creates an instance of LanguageService.
   * @param languageRepository - The repository for managing Language entities.
   * @param paginationService - The service for handling pagination of results.
   */
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Retrieves all languages with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns A paginated response containing the list of languages.
   */
  public async getAllLanguages(
    params?: PaginationQueryDto,
  ): Promise<GetLanguagesPaginatedResponseDto> {
    const queryBuilder = this.languageRepository
      .createQueryBuilder('language')
      .select();

    return await this.paginationService.paginated<
      Language,
      GetLanguagesResponseDto
    >(queryBuilder, params);
  }

  /**
   * Retrieves a language by its unique slug identifier.
   * @param slug - The unique slug of the language to retrieve.
   * @returns The language entity if found.
   * @throws NotFoundException if the language is not found.
   */
  public async getBySlug(slug: string): Promise<Language> {
    const language = await this.languageRepository.findOneBy({ slug });

    if (!language) {
      throw new NotFoundException(NOT_FOUND_LANGUAGE_ERROR);
    }

    return language;
  }

  /**
   * Retrieves a language by its unique identifier.
   * @param id - The unique identifier of the language to retrieve.
   * @returns The language entity if found.
   * @throws NotFoundException if the language is not found.
   */
  public async getById(id: number): Promise<Language> {
    const language = await this.languageRepository.findOneBy({ id });

    if (!language) {
      throw new NotFoundException(NOT_FOUND_LANGUAGE_ERROR);
    }

    return language;
  }

  /**
   * Creates a new language with the provided details.
   * @param dto - The data transfer object containing the details of the language to create.
   * @returns The created language entity.
   */
  public async create(dto: CreateLanguageRequestDto): Promise<Language> {
    const language = this.languageRepository.create({
      ...dto,
      slug: slugify(dto.slug),
    });
    return await this.languageRepository.save(language);
  }

  /**
   * Updates an existing language by its unique identifier.
   * @param id - The unique identifier of the language to update.
   * @param dto - The data transfer object containing the updated details of the language.
   * @returns The updated language entity.
   * @throws NotFoundException if the language is not found.
   */
  public async update(
    id: number,
    dto: UpdateLanguageRequestDto,
  ): Promise<Language> {
    const language = await this.getById(id);
    Object.assign(
      language,
      dto.slug ? { ...dto, slug: slugify(dto.slug) } : dto,
    );
    return await this.languageRepository.save(language);
  }

  /**
   * Deletes a language by its unique identifier.
   * @param id - The unique identifier of the language to delete.
   * @throws NotFoundException if the language is not found.
   */
  public async delete(id: number): Promise<void> {
    const { affected } = await this.languageRepository.delete({ id });

    if (!affected) {
      throw new NotFoundException(NOT_FOUND_LANGUAGE_ERROR);
    }
  }
}
