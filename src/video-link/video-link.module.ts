import { Module } from '@nestjs/common';
import { VideoLinkController } from './video-link.controller';
import { VideoLinkService } from './providers/video-link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLink } from './video-link.entity';
import { EpisodeModule } from 'src/episode/episode.module';
import { TitlesModule } from 'src/titles/titles.module';

@Module({
  controllers: [VideoLinkController],
  providers: [VideoLinkService],
  imports: [TypeOrmModule.forFeature([VideoLink]), EpisodeModule, TitlesModule],
})
export class VideoLinkModule {}
