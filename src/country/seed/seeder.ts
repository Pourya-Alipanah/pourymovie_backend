import { DataSource } from 'typeorm';
import { Country } from '../country.entity';
import { countries } from './data';

/**
 * seedCountries
 * @description This function seeds the countries data into the database.
 * It checks if countries are already seeded and skips if they are.
 * If not, it inserts the predefined countries data.
 *
 * @param {DataSource} dataSource - The TypeORM DataSource instance.
 */
export const seedCountries = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(Country);

  const existing = await repo.count();
  if (existing > 1) {
    console.log('Countries already seeded. Skipping...');
    return;
  }

  await repo.insert(countries);
  console.log('✅ Countries seeded successfully!');
};
