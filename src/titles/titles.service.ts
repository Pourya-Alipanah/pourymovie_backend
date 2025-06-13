import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Title } from './entities/title.entity';
import { In, Repository } from 'typeorm';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { TITLE_NOT_FOUND_ERROR } from './constants/titles.errors.constants';
import {
  GetTitlesResponse,
  GetTitlesResponseDto,
} from './dtos/response/get-titles.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { CreateTitleDto } from './dtos/request/create-title.dto';
import { Country } from './entities/country.entity';
import { Language } from './entities/language.entity';
import { Genre } from './entities/genre.entity';
import { TitlePerson } from './entities/title-person.entity';
import { VideoLink } from './entities/video-link.entity';
import { Season } from './entities/season.entity';
import { UpdateTitleRequestDto } from './dtos/request/update-title.dto';

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
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
    @InjectRepository(TitlePerson)
    private readonly titlePersonRepository: Repository<TitlePerson>,
    @InjectRepository(VideoLink)
    private readonly videoLinkRepository: Repository<VideoLink>,
    @InjectRepository(Season)
    private readonly seasSeasonRepository: Repository<Season>,

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
  public async findById(id: number): Promise<Title> {
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

    return result as Promise<Title>;
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

  /**
   * Creates a new title in the database.
   * @param {Title} title - The title entity to be created
   * @returns {Promise<Title>} The created title entity
   * @description This method saves a new title to the database.
   */
  public async createTitle(dto: CreateTitleDto): Promise<Title> {
    let genres: Genre[] = [];
    let country: Country | null = null;
    let language: Language | null = null;
    let people: TitlePerson[] = [];
    let videoLinks: VideoLink[] = [];
    let seasons: Season[] = [];

    if (dto.genreIds && dto.genreIds.length > 0) {
      genres = await this.genreRepository.findBy({
        id: In(dto.genreIds),
      });
    }

    if (dto.countryId) {
      country = await this.countryRepository.findOneBy({
        id: dto.countryId,
      });
    }

    if (dto.languageId) {
      language = await this.languageRepository.findOneBy({
        id: dto.languageId,
      });
    }

    if (dto.titlePersonIds && dto.titlePersonIds.length > 0) {
      people = await this.titlePersonRepository.findBy({
        id: In(dto.titlePersonIds),
      });
    }

    if (dto.videoLinkIds && dto.videoLinkIds.length > 0) {
      videoLinks = await this.videoLinkRepository.findBy({
        id: In(dto.videoLinkIds),
      });
    }

    if (dto.seasonIds && dto.seasonIds.length > 0) {
      seasons = await this.seasSeasonRepository.findBy({
        id: In(dto.seasonIds),
      });
    }

    const title = this.titleRepository.create({
      ...dto,
      genres,
      country,
      language,
      people,
      seasons,
      videoLinks,
    });
    return this.titleRepository.save(title);
  }

  /**
   * Updates an existing title by its ID.
   * @param {number} id - The unique identifier of the title to be updated
   * @param {UpdateTitleRequestDto} dto - The data transfer object containing the updated title details
   * @returns {Promise<Title>} The updated title entity
   * @throws {NotFoundException} If the title with the given ID does not exist
   * @description This method updates a title's details in the database.
   */
  public async updateTitle(id: number, dto: UpdateTitleRequestDto) {
    const title = await this.findById(id);
    const updatedTitle = Object.assign(title, dto);

    return await this.titleRepository.save(updatedTitle);
  }
}
