import { Injectable, NotFoundException } from '@nestjs/common';
import { Country } from '../country.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NOT_FOUND_COUNTRY_ERROR } from '../constants/country,errors.contants';

/**
 * CountryService
 * This service provides methods to interact with the Country entity.
 */
@Injectable()
export class CountryService {
  /**
   * Constructor for CountryService
   * @param countryRepository - Repository for the Country entity
   */
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  /**
   * Retrieves all countries from the database.
   * @returns A promise that resolves to an array of Country entities.
   */
  public async getAll(): Promise<Country[]> {
    return this.countryRepository.find({
      order: {
        nameEn: 'ASC',
      },
    });
  }

  /**
   * Retrieves a country by its slug.
   * @param slug - The slug of the country to retrieve.
   * @returns A promise that resolves to the Country entity.
   * @throws NotFoundException if the country with the given slug does not exist.
   */
  public async getBySlug(slug: string): Promise<Country> {
    const country = await this.countryRepository
      .createQueryBuilder('country')
      .leftJoinAndSelect('country.titles', 'title')
      .where('country.slug = :slug', { slug })
      .select([
        'country.id',
        'country.nameFa',
        'country.nameEn',
        'country.slug',
        'title.id',
        'title.titleFa',
        'title.titleEn',
        'title.slug',
        'title.type',
        'title.thumbnailUrl',
      ])
      .getOne();
    if (!country) {
      throw new NotFoundException(NOT_FOUND_COUNTRY_ERROR);
    }
    return country;
  }

  /**
   * Retrieves a country by its ID.
   * @param id - The ID of the country to retrieve.
   * @returns A promise that resolves to the Country entity.
   * @throws NotFoundException if the country with the given ID does not exist.
   */
  public async getById(id: number): Promise<Country> {
    const country = await this.countryRepository.findOneBy({
      id,
    });
    if (!country) {
      throw new NotFoundException(NOT_FOUND_COUNTRY_ERROR);
    }
    return country;
  }
}
