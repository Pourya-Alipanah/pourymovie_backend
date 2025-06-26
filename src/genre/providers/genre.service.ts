import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from '../genre.entity';
import { In, Repository } from 'typeorm';
import { PaginationService } from 'src/common/pagination/pagination.service';
import {
  GetGenreResponseDto,
  GetPaginatedGenreResponseDto,
} from '../dtos/response/get-genre.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import {
  GENRE_NOT_FOUND_ERROR,
  SOME_GENRE_NOT_FOUND_ERROR,
} from '../constants/genre.erros.constants';
import { CreateGenreRequestDto } from '../dtos/request/create-genre.dto';
import { UpdateGenreRequestDto } from '../dtos/request/update-genre.dto';
import slugify from 'slugify';
import { SOME_PEOPLE_NOT_FOUND_ERROR } from 'src/people/constants/people.errors.constants';

/**
 * This file is part of the "Genre Management" project.
 * It defines the GenreService class, which provides methods for managing genres.
 */
@Injectable()
export class GenreService {
  /**
   * Creates an instance of GenreService.
   * @param genreRepository - The repository for managing Genre entities.
   * @param paginationService - The service for handling pagination of results.
   */
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Retrieves all genres with optional pagination.
   * @param params - Optional pagination parameters.
   * @returns A paginated response containing the list of genres.
   */
  public async findAll(
    params?: PaginationQueryDto,
  ): Promise<GetPaginatedGenreResponseDto> {
    const queryBuilder = this.genreRepository
      .createQueryBuilder('genre')
      .select();

    return await this.paginationService.paginated<Genre, GetGenreResponseDto>(
      queryBuilder,
      params,
    );
  }

  /**
   * Retrieves a genre by its unique slug identifier.
   * @param slug - The unique slug of the genre to retrieve.
   * @returns The genre entity if found.
   * @throws NotFoundException if the genre is not found.
   */
  public async getBySlug(slug: string) {
    const genre = await this.genreRepository.findOneBy({
      slug,
    });

    if (!genre) {
      throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
    }

    return genre;
  }

  /**
   * Retrieves a genre by its unique identifier.
   * @param id - The unique identifier of the genre to retrieve.
   * @returns The genre entity if found.
   * @throws NotFoundException if the genre is not found.
   */
  public async getById(id: number) {
    const genre = await this.genreRepository.findOneBy({
      id,
    });

    if (!genre) {
      throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
    }

    return genre;
  }

  /**
   * Retrieves multiple genres by their unique identifiers.
   * @param ids - An array of unique identifiers for the genres to retrieve.
   * @returns An array of genre entities if found.
   * @throws NotFoundException if any of the genres are not found.
   */
  public async findMultipleById(ids: number[] | null): Promise<Genre[]> {
    const uniqueIds = Array.from(new Set(ids));
    const genre = await this.genreRepository.find({
      where: { id: In(uniqueIds) },
    });
    if (genre.length < uniqueIds.length) {
      throw new NotFoundException(SOME_GENRE_NOT_FOUND_ERROR);
    }
    return genre;
  }

  /**
   * Creates a new genre with the provided details.
   * @param dto - The data transfer object containing the details of the genre to create.
   * @returns The created genre entity.
   */
  public async create(
    dto: CreateGenreRequestDto,
  ): Promise<GetGenreResponseDto> {
    const genre = this.genreRepository.create({
      ...dto,
      slug: slugify(dto.slug),
    });

    return await this.genreRepository.save(genre);
  }

  /**
   * Updates an existing genre by its unique identifier.
   * @param id - The unique identifier of the genre to update.
   * @param dto - The data transfer object containing the updated details of the genre.
   * @returns The updated genre entity.
   * @throws NotFoundException if the genre is not found.
   */
  public async update(id: number, dto: UpdateGenreRequestDto) {
    const genre = await this.getById(id);

    Object.assign(genre, dto.slug ? { ...dto, slug: slugify(dto.slug) } : dto);

    return await this.genreRepository.save(genre);
  }

  /**
   * Deletes a genre by its unique identifier.
   * @param id - The unique identifier of the genre to delete.
   * @throws NotFoundException if the genre is not found.
   */
  public async delete(id: number) {
    const { affected } = await this.genreRepository.delete(id);

    if (!affected) {
      throw new NotFoundException(GENRE_NOT_FOUND_ERROR);
    }
  }
}
