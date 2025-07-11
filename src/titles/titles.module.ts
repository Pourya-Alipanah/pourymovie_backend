import { forwardRef, Module } from '@nestjs/common';
import { TitlesController } from './titles.controller';
import { TitlesService } from './titles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from '../country/country.entity';
import { Title } from './entities/title.entity';
import { Language } from '../language/language.entity';
import { Season } from '../season/season.entity';
import { TitlePerson } from './entities/title-person.entity';
import { VideoLink } from '../video-link/video-link.entity';
import { Person } from 'src/people/person.entity';
import { Episode } from 'src/episode/episode.entity';
import { SeasonModule } from 'src/season/season.module';
import { EpisodeModule } from 'src/episode/episode.module';
import { PeopleModule } from 'src/people/people.module';
import { LanguageModule } from 'src/language/language.module';
import { Genre } from 'src/genre/genre.entity';
import { GenreModule } from 'src/genre/genre.module';
import { CountryModule } from 'src/country/country.module';
import appConfig from 'src/config/app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TitlesController],
  providers: [TitlesService],
  imports: [
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forFeature([
      Title,
      Country,
      Episode,
      Genre,
      Language,
      Season,
      TitlePerson,
      VideoLink,
      Person,
    ]),
    forwardRef(() => SeasonModule),
    forwardRef(() => EpisodeModule),
    PeopleModule,
    LanguageModule,
    GenreModule,
    CountryModule,
  ],
  exports: [TitlesService],
})
export class TitlesModule {}
