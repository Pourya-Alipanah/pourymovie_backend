import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Title } from './entities/title.entity';
import { Repository } from 'typeorm';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { TITLE_NOT_FOUND_ERROR } from './constants/titles.errors.constants';
import {
  GetTitlesResponse,
  GetTitlesResponseDto,
} from './dtos/response/get-titles.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';

/**
 * Service for handling operations related to titles.
 */
@Injectable()
export class TitlesService {
  /**
   * Injects the repository for Title entity.
   * @param {Repository<Title>} titleRepository - Repository for Title entity
   */
  constructor(
    @InjectRepository(Title)
    private readonly titleRepository: Repository<Title>,

    private readonly paginationService: PaginationService,
  ) {}

  /**
   * Finds a title by its ID, including all related entities.
   *
   * @param {number} id - The unique identifier of the title
   * @returns {Promise<Title>} The title entity with all relations, or null if not found
   * @throws {NotFoundException} If the title with the given ID does not exist
   * @description This method retrieves a title by its ID, including related entities such as genres, country,
   */
  public async findById(id: number): Promise<Title | null> {
    const result = this.titleRepository.findOne({
      where: { id },
      relations: [
        'genres',
        'country',
        'seasons',
        'videoLinks',
        'people',
        'people.person',
        'comments',
        'comments.user',
        'language',
        'seasons.episodes',
        'seasons.episodes.videoLinks',
      ],
    });

    if (!result) {
      throw new NotFoundException(TITLE_NOT_FOUND_ERROR);
    }

    return result;
  }

  /**
   * Fetches all titles with pagination and related entities.
   * @param {PaginationQueryDto} [params] - Optional pagination parameters
   * @return {Promise<GetTitlesResponse>} Paginated response containing titles and their related entities
   * @description This method retrieves all titles from the database, including their genres, country, language,
   */
  public async findAllTitles(
    params?: PaginationQueryDto,
  ): Promise<GetTitlesResponse> {
    const queryBuilder = this.titleRepository
      .createQueryBuilder('title')
      .leftJoinAndSelect('title.genres', 'genres')
      .leftJoinAndSelect('title.country', 'country')
      .leftJoinAndSelect('title.language', 'language')
      .leftJoinAndSelect('title.people', 'people')
      .leftJoinAndSelect('people.person', 'person');

    const result = await this.paginationService.paginated<
      Title,
      GetTitlesResponseDto
    >(queryBuilder, params);
    return result;
  }

  /**
   * Deletes a title by its ID.
   * @param {number} id - The unique identifier of the title to be deleted
   * @returns {Promise<void>} A promise that resolves when the title is deleted
   * @throws {NotFoundException} If the title with the given ID does not exist
   * @description This method deletes a title from the database by its ID.
   */
  public async deleteTitleById(id: number): Promise<void> {
    const { affected } = await this.titleRepository.delete(id);
    if (!affected) throw new NotFoundException(TITLE_NOT_FOUND_ERROR);
  }
}
