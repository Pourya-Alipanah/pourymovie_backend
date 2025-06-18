import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Episode } from '../episode.entity';
import { Repository } from 'typeorm';
import { EPISODE_NOT_FOUND_ERROR } from '../constants/episode.errors.constants';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectRepository(Episode)
    private readonly episodeRepository: Repository<Episode>,
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
}
