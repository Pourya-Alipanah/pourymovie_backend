import { forwardRef, Module } from '@nestjs/common';
import { TitlesController } from './titles.controller';
import { TitlesService } from './titles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Title } from './entities/title.entity';
import { Genre } from './entities/genre.entity';
import { Language } from './entities/language.entity';
import { Season } from '../season/season.entity';
import { TitlePerson } from './entities/title-person.entity';
import { VideoLink } from './entities/video-link.entity';
import { Person } from 'src/people/person.entity';
import { Episode } from 'src/episode/episode.entity';
import { SeasonModule } from 'src/season/season.module';
import { EpisodeModule } from 'src/episode/episode.module';
import { PeopleModule } from 'src/people/people.module';

@Module({
  controllers: [TitlesController],
  providers: [TitlesService],
  imports: [
    TypeOrmModule.forFeature([
      Country,
      Title,
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
  ],
  exports: [TitlesService],
})
export class TitlesModule {}
