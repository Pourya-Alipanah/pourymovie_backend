import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './providers/country.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import {
  GetCountryResponseDto,
  GetSingleCountryResponseDto,
} from './dtos/response/get-country.dto';
import { GetBySlugParamDto } from 'src/common/dto/request/slug-param.dto';

/**
 * Controller for managing countries.
 * Provides endpoints to retrieve all countries and a specific country by its slug.
 * Uses the CountryService to interact with the country data.
 */
@Controller({ version: '1', path: 'country' })
export class CountryController {
  /**
   * Constructor for the CountryController.
   * @param countryService - The service to handle country-related operations.
   */
  constructor(private readonly countryService: CountryService) {}

  /**
   * Endpoint to get all countries.
   * @returns A list of all countries.
   */
  @ApiOperation({
    summary: 'Get all countries',
    description: 'Retrieve a list of all countries.',
  })
  @Get()
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetCountryResponseDto,true)
  getAllCountries() {
    return this.countryService.getAll();
  }

  /**
   * Endpoint to get a country by its slug.
   * @param slug - The slug of the country to retrieve.
   * @returns The country with the specified slug.
   */
  @ApiOperation({
    summary: 'Get country by slug',
    description: 'Retrieve a single country by its slug.',
  })
  @Get(':slug')
  @ApiBearerAuth('access-token')
  @ApiSingleResponse(GetSingleCountryResponseDto)
  getCountryBySlug(@Param() { slug }: GetBySlugParamDto) {
    return this.countryService.getBySlug(slug);
  }
}
