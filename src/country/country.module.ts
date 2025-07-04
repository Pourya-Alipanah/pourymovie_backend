import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';
import { CountryService } from './providers/country.service';
import { Country } from './country.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [CountryController],
  providers: [CountryService],
  imports: [TypeOrmModule.forFeature([Country])],
  exports: [CountryService],
})
export class CountryModule {}
