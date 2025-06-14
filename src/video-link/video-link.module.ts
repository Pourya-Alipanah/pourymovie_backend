import { Module } from '@nestjs/common';
import { VideoLinkController } from './video-link.controller';
import { VideoLinkService } from './providers/video-link.service';

@Module({
  controllers: [VideoLinkController],
  providers: [VideoLinkService]
})
export class VideoLinkModule {}
