import { ApiProperty } from '@nestjs/swagger';
import { VideoQuality } from '../../enums/video-quality.enum';

/**
 * Interface representing a video link with its properties.
 * This interface is used to define the structure of a video link object.
 * @class VideoLink
 */
export class VideoLink {
  /**
   * Unique identifier for the video link
   * @type {number}
   */
  @ApiProperty({
    description: 'Unique identifier for the video link',
    name: 'id',
    type: 'number',
    required: true,
  })
  id: number;

  /**
   * URL of the video link
   * @type {string}
   */
  @ApiProperty({
    description: 'URL of the video link',
    name: 'url',
    type: 'string',
    required: true,
  })
  url: string;

  /**
   * Quality of the video link
   * @type {VideoQuality}
   */
  @ApiProperty({
    description: 'Quality of the video link',
    name: 'quality',
    enum: VideoQuality,
    required: true,
  })
  quality: VideoQuality;
}
