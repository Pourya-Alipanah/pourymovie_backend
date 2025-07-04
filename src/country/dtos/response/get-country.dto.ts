import { TitleSummaryDto } from 'src/titles/dtos/helper/title-summary.dto';
import { Country } from '../helper/country.dto';

/**
 * Data Transfer Object (DTO) for the response of a country.
 * This class extends the Country class to provide a structured response
 */
export class GetCountryResponseDto extends Country {}

/**
 * Data Transfer Object (DTO) for the response of a single country.
 * This class extends the Country class and includes an array of TitleSummaryDto
 */
export class GetSingleCountryResponseDto extends Country {
  /**
   * Array of TitleSummaryDto representing the titles associated with the country.
   */
  titles: TitleSummaryDto[];
}
