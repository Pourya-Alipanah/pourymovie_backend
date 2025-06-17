import { Module } from '@nestjs/common';
import { TitlesController } from './titles.controller';
import { TitlesService } from './titles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Title } from './entities/title.entity';
import { Episode } from './entities/episode.entity';
import { Genre } from './entities/genre.entity';
import { Language } from './entities/language.entity';
import { Season } from '../season/season.entity';
import { TitlePerson } from './entities/title-person.entity';
import { VideoLink } from './entities/video-link.entity';
import { Person } from 'src/people/person.entity';

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
  ],
})
export class TitlesModule {}
