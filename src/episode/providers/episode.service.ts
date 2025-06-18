import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from '../episode.entity';
import { Repository } from 'typeorm';
import { EPISODE_NOT_FOUND_ERROR } from '../constants/episode.errors.constants';
import { CreateEpisodeRequestDto } from '../dtos/request/create-episode.dto';
import { UpdateEpisodeRequestDto } from '../dtos/request/update-episode.dto';
import { SeasonService } from 'src/season/providers/season.service';
import { Season } from 'src/season/season.entity';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
    private readonly seasonService: SeasonService,
  ) {}

  public async getAllEpisodesWithSeasonId(id: number) {
    return this.episodeRepository.find({
      where: { season: { id } },
      order: { episodeNumber: 'ASC' },
      relations: ['videoLinks'],
    });
  }

  public async deleteEpisode(id: number) {
    const { affected } = await this.episodeRepository.delete(id);
    if (!affected) {
      throw new NotFoundException(EPISODE_NOT_FOUND_ERROR);
    }
  }

  public async createEpisode(dto: CreateEpisodeRequestDto) {
    const season = await this.seasonService.getSeasonById(dto.seasonId);
    const episode = this.episodeRepository.create({
      ...dto,
      season: { id: season.id },
    });

    return this.episodeRepository.save(episode);
  }

  public async updateEpisode(id: number, dto: UpdateEpisodeRequestDto) {
    let season: Season | null = null;

    const episode = await this.episodeRepository.findOne({ where: { id } });

    if (!episode) {
      throw new NotFoundException(EPISODE_NOT_FOUND_ERROR);
    }

    if (dto.seasonId) {
      season = await this.seasonService.getSeasonById(dto.seasonId);
    }

    const finalDto = dto.seasonId
      ? {
          ...dto,
          season: { id: season?.id },
        }
      : dto;

    Object.assign(episode, finalDto);

    return this.episodeRepository.save(episode);
  }
}
