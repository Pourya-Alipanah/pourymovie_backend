import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Title } from './entities/title.entity';
import { DataSource, ILike, In, Repository } from 'typeorm';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { TITLE_NOT_FOUND_ERROR } from './constants/titles.errors.constants';
import {
  GetTitlesResponse,
  GetTitlesResponseDto,
} from './dtos/response/get-titles.dto';
import { PaginationQueryDto } from 'src/common/pagination/dtos/pagination.dto';
import { CreateTitleDto } from './dtos/request/create-title.dto';
import { TitlePerson } from './entities/title-person.entity';
import { VideoLink } from '../video-link/video-link.entity';
import { UpdateTitleRequestDto } from './dtos/request/update-title.dto';
import slugify from 'slugify';
import { PeopleService } from 'src/people/people.service';
import { LanguageService } from '../language/providers/language.service';
import { GenreService } from 'src/genre/providers/genre.service';
import { CountryService } from 'src/country/providers/country.service';
import { UploadCenterService } from 'src/upload-center/providers/upload-center.service';
import { UploadFromEntity } from 'src/upload-center/enums/upload-from-entity.enum';
import { UploadType } from 'src/upload-center/enums/upload-type.enum';
import { TitleType } from './enums/title-type.enum';
import appConfig from 'src/config/app.config';
import { ConfigType } from '@nestjs/config';

/**
 * Service for handling operations related to titles.
 */
@Injectable({ scope: Scope.REQUEST })
export class TitlesService {
  /**
   * Injects the repository for Title entity.
   * @param {Repository<Title>} titleRepository - Repository for Title entity
   * @param {Repository<TitlePerson>} titlePersonRepository - Repository for TitlePerson entity
   * @param {Repository<VideoLink>} videoLinkRepository - Repository for VideoLink entity
   * @param {DataSource} dataSource - Data source for database transactions
   * @param {PaginationService} paginationService - Service for handling pagination
   * @param {PeopleService} peopleService - Service for handling people-related operations
   * @param {LanguageService} languageService - Service for handling language-related operations
   * @param {GenreService} genreService - Service for handling genre-related operations
   * @param {CountryService} countryService - Service for handling country-related operations
   * @param {UploadCenterService} uploadCenterService - Service for handling file uploads
   */
  constructor(
    @InjectRepository(Title)
    private readonly titleRepository: Repository<Title>,
    @InjectRepository(TitlePerson)
    private readonly titlePersonRepository: Repository<TitlePerson>,
    @InjectRepository(VideoLink)
    private readonly videoLinkRepository: Repository<VideoLink>,
    private readonly dataSource: DataSource,
    private readonly paginationService: PaginationService,
    private readonly peopleService: PeopleService,
    private readonly languageService: LanguageService,
    private readonly genreService: GenreService,
    private readonly countryService: CountryService,
    private readonly uploadCenterService: UploadCenterService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
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
    });

    if (!result) {
      throw new NotFoundException(TITLE_NOT_FOUND_ERROR);
    }

    return result;
  }

  /**
   * Finds a title link by its slug candidate, which is generated from the title.
   *
   * @param {string} titleFromGemini - The title string from Gemini
   * @returns {Promise<string | null>} The URL of the title if found, otherwise null
   * @description This method generates a slug from the title and checks if a title with that slug exists.
   * If it exists, it returns the URL for the movie or series based on its type.
   */
  public async findTitleLinkBySlugCandidate(
    titleFromGemini: string,
  ): Promise<string | null> {
    const slug = slugify(titleFromGemini, { lower: true, strict: true });

    try {
      const title = await this.titleRepository.findOne({
        where: { slug: ILike(slug) },
        select: ['slug', 'type' , 'id'],
      });
      if (title && title?.type === TitleType.Movie) {
        return `${this.appConfiguration.frontendUrl}/${this.appConfiguration.frontendMoviePath}/${title.slug}`;
      }
      if (title && title?.type === TitleType.Series) {
        return `${this.appConfiguration.frontendUrl}/${this.appConfiguration.frontendSeriesPath}/${title.slug}`;
      }

      return null;
    } catch (error) {
      console.error('Error finding title link by slug candidate:', error);
      return null;
    }
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
      let coverUrl: string | null = null;
      let thumbnailUrl: string | null = null;
      let trailerUrl: string | null = null;
      const [genres, country, language, people, videoLinks] = await Promise.all(
        [
          this.genreService.findMultipleById(dto.genreIds),
          this.countryService.getById(dto.countryId),
          this.languageService.getById(dto.languageId),
          this.peopleService.findMultipleById(
            dto.titlePeople.map((tp) => tp.id),
          ),
          this.findVideoLinks(dto.videoLinkIds),
        ],
      );

      if (dto.coverUrl) {
        const url = await this.uploadCenterService.confirmUpload(
          dto.coverUrl.key,
          UploadFromEntity.TITLE,
          UploadType.COVER,
        );

        coverUrl = url;
      }
      if (dto.thumbnailUrl) {
        const url = await this.uploadCenterService.confirmUpload(
          dto.thumbnailUrl.key,
          UploadFromEntity.TITLE,
          UploadType.THUMBNAIL,
        );

        thumbnailUrl = url;
      }
      if (dto.trailerUrl) {
        const url = await this.uploadCenterService.confirmUpload(
          dto.trailerUrl.key,
          UploadFromEntity.TITLE,
          UploadType.TRAILER,
        );

        trailerUrl = url;
      }

      const titlePeopleArray = dto.titlePeople.map((tp) => ({
        person: people.find((p) => p.id === tp.id),
        role: tp.role,
      }));

      const titlePeople: TitlePerson[] =
        this.titlePersonRepository.create(titlePeopleArray);

      const resultTitlePeople = await manager.save(titlePeople);

      const title = manager.create(Title, {
        ...dto,
        slug: slugify(dto.slug),
        genres,
        country,
        language,
        people: resultTitlePeople,
        videoLinks,
        coverUrl,
        trailerUrl,
        thumbnailUrl,
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
  public async updateTitle(
    id: number,
    dto: UpdateTitleRequestDto,
  ): Promise<Title> {
    const existingTitle = await this.findById(id);

    return await this.dataSource.transaction(async (manager) => {
      let coverUrl: string | null = existingTitle.coverUrl;
      let thumbnailUrl: string | null = existingTitle.thumbnailUrl;
      let trailerUrl: string | null = existingTitle.trailerUrl;
      let updatedGenres = existingTitle.genres;
      let updatedCountry = existingTitle.country;
      let updatedLanguage = existingTitle.language;
      let updatedVideoLinks = existingTitle.videoLinks;
      let updatedTitlePeople = existingTitle.people;

      if (dto.genreIds) {
        updatedGenres = await this.genreService.findMultipleById(dto.genreIds);
      }

      if (dto.countryId) {
        updatedCountry = await this.countryService.getById(dto.countryId);
      }

      if (dto.languageId) {
        updatedLanguage = await this.languageService.getById(dto.languageId);
      }

      if (dto.videoLinkIds) {
        updatedVideoLinks = await this.findVideoLinks(dto.videoLinkIds);
      }

      if (dto.coverUrl) {
        const url = await this.uploadCenterService.confirmUpload(
          dto.coverUrl.key,
          UploadFromEntity.TITLE,
          UploadType.COVER,
        );

        coverUrl = url;
      }
      if (dto.thumbnailUrl) {
        const url = await this.uploadCenterService.confirmUpload(
          dto.thumbnailUrl.key,
          UploadFromEntity.TITLE,
          UploadType.THUMBNAIL,
        );

        thumbnailUrl = url;
      }
      if (dto.trailerUrl) {
        const url = await this.uploadCenterService.confirmUpload(
          dto.trailerUrl.key,
          UploadFromEntity.TITLE,
          UploadType.TRAILER,
        );

        trailerUrl = url;
      }

      if (dto.titlePeople) {
        const people = await this.peopleService.findMultipleById(
          dto.titlePeople.map((tp) => tp.id),
        );

        const titlePeopleArray = dto.titlePeople.map((tp) => ({
          person: people.find((p) => p.id === tp.id),
          role: tp.role,
          title: existingTitle,
        }));

        updatedTitlePeople =
          this.titlePersonRepository.create(titlePeopleArray);
      }

      const updatedTitle = manager.merge(Title, existingTitle, {
        ...dto,
        slug: slugify(dto.slug || existingTitle.slug),
        genres: updatedGenres,
        country: updatedCountry,
        language: updatedLanguage,
        videoLinks: updatedVideoLinks,
        people: updatedTitlePeople,
        coverUrl,
        thumbnailUrl,
        trailerUrl,
      });

      return await manager.save(updatedTitle);
    });
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
