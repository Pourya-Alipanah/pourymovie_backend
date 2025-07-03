import { Module } from '@nestjs/common';
import { VideoLinkController } from './video-link.controller';
import { VideoLinkService } from './providers/video-link.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoLink } from './video-link.entity';

@Module({
  controllers: [VideoLinkController],
  providers: [VideoLinkService],
  imports: [TypeOrmModule.forFeature([VideoLink])],
})
export class VideoLinkModule {}
