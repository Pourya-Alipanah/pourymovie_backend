import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Title } from './entities/title.entity';
import { DataSource, In, Repository } from 'typeorm';
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
import { Season } from '../season/season.entity';
import { UpdateTitleRequestDto } from './dtos/request/update-title.dto';
import slugify from 'slugify';
import { Person } from 'src/people/person.entity';
import { CreateTitlePersonRequestDto } from './dtos/request/create-title-person.dto';

/**
 * Service for handling operations related to titles.
 */
@Injectable()
export class TitlesService {
  /**
   * Injects the repository for Title entity.
   * @param {Repository<Title>} titleRepository - Repository for Title entity
   * @param {Repository<Country>} countryRepository - Repository for Country entity
   * @param {Repository<Language>} languageRepository - Repository for Language entity
   * @param {Repository<Genre>} genreRepository - Repository for Genre entity
   * @param {Repository<TitlePerson>} titlePersonRepository - Repository for TitlePerson entity
   * @param {Repository<Person>} personRepository - Repository for Person entity
   * @param {Repository<VideoLink>} videoLinkRepository - Repository for VideoLink entity
   * @param {Repository<Season>} seasSeasonRepository - Repository for Season entity
   * @param {DataSource} dataSource - Data source for database transactions
   * @param {PaginationService} paginationService - Service for handling pagination
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
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
    @InjectRepository(VideoLink)
    private readonly videoLinkRepository: Repository<VideoLink>,
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    private readonly dataSource: DataSource,
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
    const result = await this.titleRepository.findOne({
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
   * Finds a title by its slug, including all related entities.
   *
   * @param {string} slug - The unique slug of the title
   * @returns {Promise<Title>} The title entity with all relations, or null if not found
   * @throws {NotFoundException} If the title with the given slug does not exist
   * @description This method retrieves a title by its slug, including related entities such as genres, country,
   */
  public async findBySlug(slug: string): Promise<Title> {
    const result = await this.titleRepository.findOne({
      where: { slug },
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

  /**
   * Creates a new title in the database.
   * @param {Title} title - The title entity to be created
   * @returns {Promise<Title>} The created title entity
   * @description This method saves a new title to the database.
   */
  public async createTitle(dto: CreateTitleDto): Promise<Title> {
    return this.dataSource.transaction(async (manager) => {
      const [genres, country, language, people, videoLinks] =
        await Promise.all([
          this.findGenres(dto.genreIds ?? undefined),
          this.findCountry(dto.countryId),
          this.findLanguage(dto.languageId),
          this.findPeople(dto.titlePeople),
          this.findVideoLinks(dto.videoLinkIds),
        ]);

      const titlePeople: TitlePerson[] = this.titlePersonRepository.create(
        dto.titlePeople.map((tp) => ({
          person: people.find((p) => p.id === tp.id),
          role: tp.role,
        })),
      );

      const resultTitlePeople = await manager.save(titlePeople);

      const title = manager.create(Title, {
        ...dto,
        slug: slugify(dto.slug),
        genres,
        country,
        language,
        people: resultTitlePeople,
        videoLinks,
      });
      return manager.save(title);
    });
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
    const updatedTitle = Object.assign(title, {
      ...dto,
      slug: slugify(dto.slug || title.slug),
    });

    return await this.titleRepository.save(updatedTitle);
  }

  /**
   * Finds genres by their IDs.
   * @param {number[]} [ids] - Optional array of genre IDs
   * @returns {Promise<Genre[]>} Array of Genre entities
   * @description This method retrieves genres from the database based on the provided IDs.
   */
  private async findGenres(ids?: number[]) {
    return ids?.length ? this.genreRepository.findBy({ id: In(ids) }) : [];
  }

  /**
   * Finds a country by its ID.
   * @param {number} [id] - Optional country ID
   * @returns {Promise<Country>} Country entity or null if not found
   * @description This method retrieves a country from the database based on the provided ID.
   */
  private async findCountry(id?: number) {
    return id ? this.countryRepository.findOneBy({ id }) : null;
  }

  /**
   * Finds a language by its ID.
   * @param {number} [id] - Optional language ID
   * @returns {Promise<Language>} Language entity or null if not found
   * @description This method retrieves a language from the database based on the provided ID.
   */
  private async findLanguage(id?: number) {
    return id ? this.languageRepository.findOneBy({ id }) : null;
  }

  /**
   * Finds people by their IDs.
   * @param {CreateTitlePersonRequestDto[]} [titlePeople] - Optional array of title person DTOs
   * @returns {Promise<Person[]>} Array of Person entities
   * @description This method retrieves people from the database based on the provided title person DTOs.
   */
  private async findPeople(
    titlePeople?: CreateTitlePersonRequestDto[],
  ): Promise<Person[]> {
    const ids = titlePeople?.map((tp) => tp.id);
    return ids?.length ? this.personRepository.findBy({ id: In(ids) }) : [];
  }

  /**
   * Finds video links by their IDs.
   * @param {number[]} [ids] - Optional array of video link IDs
   * @returns {Promise<VideoLink[]>} Array of VideoLink entities
   * @description This method retrieves video links from the database based on the provided IDs.
   */
  private async findVideoLinks(ids?: number[]) {
    return ids?.length ? this.videoLinkRepository.findBy({ id: In(ids) }) : [];
  }
}
