import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { seedCountries } from './seeder';

/**
 * bootstrap
 * @description This function is responsible for bootstrapping the application.
 * It creates the application context and seeds the countries data.
 */
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const dataSource = app.get(DataSource);

  await seedCountries(dataSource);

  await app.close();
}

bootstrap();
