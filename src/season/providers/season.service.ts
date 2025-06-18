import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Season } from 'src/season/season.entity';
import { Repository } from 'typeorm';
import { SEASON_NOT_FOUND_ERROR } from '../constants/season.errors.constants';
import { CreateSeasonRequestDto } from '../dtos/request/create-season.dto';
import { TitlesService } from 'src/titles/titles.service';

/**
 * This file is part of the "Season Management" project.
 * It defines the SeasonService used to manage seasons of titles.
 * It provides methods to create, update, delete, and retrieve seasons.
 * @module SeasonService
 */
@Injectable()
export class SeasonService {
  /**
   * Creates an instance of SeasonService.
   * @param {Repository<Season>} seasonRepository - The repository for managing seasons.
   */
  constructor(
    @InjectRepository(Season)
    private readonly seasonRepository: Repository<Season>,
    private readonly titlesService: TitlesService,
  ) {}

  /**
   * Retrieves all seasons associated with a specific title ID.
   * @param {number} id - The ID of the title for which to retrieve seasons.
   * @returns {Promise<Season[]>} A promise that resolves to an array of seasons.
   */
  public async getAllSeasonsWithTitleId(id: number) {
    return this.seasonRepository.find({
      where: { title: { id } },
      order: { seasonNumber: 'ASC' },
      relations: ['episodes', 'episodes.videoLinks'],
    });
  }

  /**
   * Retrieves season by ID.
   * @param {number} id - The ID of the season.
   * @returns {Promise<Season>} A promise that resolves to an Season Object.
   */
  public async getSeasonById(id: number) {
    const season = await this.seasonRepository.findOne({
      where: { id },
    });
    if (!season) {
      throw new NotFoundException(SEASON_NOT_FOUND_ERROR);
    }
    return season;
  }

  /**
   * Retrieves a specific season by its ID.
   * @param {number} id - The ID of the season to retrieve.
   * @returns {Promise<Season>} A promise that resolves to the season with the specified ID.
   */
  public async createSeason(dto: CreateSeasonRequestDto) {
    const title = await this.titlesService.findById(dto.titleId);
    const season = this.seasonRepository.create({
      ...dto,
      title: { id: title.id },
    });
    const savedSeason = this.seasonRepository.save(season);
    return savedSeason;
  }

  /**
   * Deletes a season by its ID.
   * @param {number} id - The ID of the season to delete.
   * @returns {Promise<void>} A promise that resolves when the season is deleted.
   */
  public async deleteSeason(id: number) {
    const { affected } = await this.seasonRepository.delete(id);
    if (!affected) {
      throw new NotFoundException(SEASON_NOT_FOUND_ERROR);
    }
  }

  /**
   * Updates a season by its ID with the provided data.
   * @param {number} id - The ID of the season to update.
   * @param {Partial<Season>} dto - The data to update the season with.
   * @returns {Promise<Season>} A promise that resolves to the updated season.
   */
  public async updateSeason(id: number, dto: Partial<Season>) {
    const season = await this.seasonRepository.findOne({ where: { id } });
    if (!season) {
      throw new NotFoundException(SEASON_NOT_FOUND_ERROR);
    }
    Object.assign(season, dto);
    return this.seasonRepository.save(season);
  }
}
