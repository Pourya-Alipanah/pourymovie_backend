import { Module } from '@nestjs/common';
import { EpisodeController } from './episode.controller';
import { EpisodeService } from './providers/episode.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from './episode.entity';

@Module({
  controllers: [EpisodeController],
  providers: [EpisodeService],
  imports: [TypeOrmModule.forFeature([Episode])],
})
export class EpisodeModule {}
