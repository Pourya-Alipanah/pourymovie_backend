import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Season } from 'src/season/season.entity';
import { Repository } from 'typeorm';
import { SEASON_NOT_FOUND_ERROR } from '../constants/season.errors.constants';
import { CreateSeasonRequestDto } from '../dtos/request/create-season.dto';

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
   * Retrieves a specific season by its ID.
   * @param {number} id - The ID of the season to retrieve.
   * @returns {Promise<Season>} A promise that resolves to the season with the specified ID.
   */
  public async createSeason(dto: CreateSeasonRequestDto) {
    const season = this.seasonRepository.create(dto);
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
