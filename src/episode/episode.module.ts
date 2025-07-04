import { forwardRef, Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './providers/episode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './episode.entity';
import { SeasonModule } from 'src/season/season.module';

@Module({
  controllers: [EpisodeController],
  providers: [EpisodeService],
  imports: [TypeOrmModule.forFeature([Episode]), SeasonModule],
  exports: [EpisodeService],
})
export class EpisodeModule {}
