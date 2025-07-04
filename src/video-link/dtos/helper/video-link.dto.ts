import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { VideoQuality } from 'src/titles/enums/video-quality.enum';
import { ConfirmUploadRequestDto } from 'src/upload-center/dtos/request/confirm-upload.dto';

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
   * @type {ConfirmUploadRequestDto}
   */
  @ApiProperty({
    description: 'URL of the video link',
    name: 'url',
    type: ConfirmUploadRequestDto,
    required: true,
  })
  @ValidateNested()
  @Type(() => ConfirmUploadRequestDto)
  url: ConfirmUploadRequestDto;

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
