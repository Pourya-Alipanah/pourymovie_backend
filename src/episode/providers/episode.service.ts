import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from '../episode.entity';
import { Repository } from 'typeorm';
import { EPISODE_NOT_FOUND_ERROR } from '../constants/episode.errors.constants';
import { CreateEpisodeRequestDto } from '../dtos/request/create-episode.dto';
import { UpdateEpisodeRequestDto } from '../dtos/request/update-episode.dto';
import { SeasonService } from 'src/season/providers/season.service';
import { Season } from 'src/season/season.entity';

/**
 * Service for managing episodes in the application.
 * Provides methods to create, read, update, and delete episodes.
 */
@Injectable()
export class EpisodeService {
  /**
   * Initializes the EpisodeService with the Episode repository and SeasonService.
   * @param episodeRepository - The repository for the Episode entity.
   * @param seasonService - The service responsible for season operations.
   */
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    private readonly seasonService: SeasonService,
  ) {}

  /**
   * Retrieves an episode by its unique ID.
   * @param id - The unique identifier of the episode.
   * @returns The episode with the specified ID.
   * @throws NotFoundException if the episode is not found.
   */
  public async findById(id: number) {
    const episode = await this.episodeRepository.findOneBy({
      id,
    });

    if (!episode) {
      throw new NotFoundException(EPISODE_NOT_FOUND_ERROR);
    }

    return episode;
  }

  /**
   * Retrieves all episodes associated with a specific season ID.
   * @param id - The unique identifier of the season.
   * @returns A list of episodes for the specified season.
   */
  public async getAllEpisodesWithSeasonId(id: number) {
    return this.episodeRepository.find({
      where: { season: { id } },
      order: { episodeNumber: 'ASC' },
      relations: ['videoLinks'],
    });
  }

  /**
   * Deletes an episode by its unique ID.
   * @param id - The unique identifier of the episode to be deleted.
   * @throws NotFoundException if the episode is not found.
   */
  public async deleteEpisode(id: number) {
    const { affected } = await this.episodeRepository.delete(id);
    if (!affected) {
      throw new NotFoundException(EPISODE_NOT_FOUND_ERROR);
    }
  }

  /**
   * Creates a new episode.
   * @param dto - The data transfer object containing episode details.
   * @returns The created episode.
   */
  public async createEpisode(dto: CreateEpisodeRequestDto) {
    const season = await this.seasonService.getSeasonById(dto.seasonId);
    const episode = this.episodeRepository.create({
      ...dto,
      season: { id: season.id },
    });

    return this.episodeRepository.save(episode);
  }

  /**
   * Updates an existing episode by its unique ID.
   * @param id - The unique identifier of the episode to be updated.
   * @param dto - The data transfer object containing updated episode details.
   * @returns The updated episode.
   * @throws NotFoundException if the episode is not found.
   */
  public async updateEpisode(id: number, dto: UpdateEpisodeRequestDto) {
    const episode = await this.episodeRepository.findOne({ where: { id } });

    if (!episode) {
      throw new NotFoundException(EPISODE_NOT_FOUND_ERROR);
    }

    let season: Season = episode?.season;

    if (dto.seasonId) {
      season = await this.seasonService.getSeasonById(dto.seasonId);
    }

    Object.assign(episode, {
      ...dto,
      season: { id: season?.id },
    });

    return this.episodeRepository.save(episode);
  }
}
