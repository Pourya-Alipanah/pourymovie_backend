import { ApiProperty } from '@nestjs/swagger';
import { VideoLink } from 'src/video-link/dtos/helper/video-link.dto';

/**
 * This file is part of the "Title Management" project.
 * It defines the Episode interface used to represent an episode of a TV series or show.
 */
export class Episode {
  /**
   * Unique identifier for the episode
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the episode',
    name: 'id',
    type: 'number',
  })
  id: number;

  /**
   * Number of the episode in the series
   * @type {number}
   */
  @ApiProperty({
    description: 'Number of the episode in the series',
    name: 'episodeNumber',
    type: 'number',
  })
  episodeNumber: number;

  /**
   * video links associated with the episode
   * This array contains multiple video links for different qualities or sources.
   * @type {VideoLink[]}
   */
  @ApiProperty({
    description: 'Video links associated with the episode',
    name: 'videoLinks',
    type: [VideoLink],
  })
  VideoLinks: VideoLink[];
}
