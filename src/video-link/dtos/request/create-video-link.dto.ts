import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { IsOnlyOneDefined } from 'src/common/validation/is-Only-One-defined.validation';
import { VideoQuality } from 'src/titles/enums/video-quality.enum';
import { ConfirmUploadRequestDto } from 'src/upload-center/dtos/request/confirm-upload.dto';

export class CreateVideoLinkRequestDto {
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
  @IsNotEmpty()
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
  @IsEnum(VideoQuality)
  @IsNotEmpty()
  quality: VideoQuality;

  /**
   * ID of the episode to which this video link belongs
   * @type {number}
   */
  @ApiProperty({
    description: 'ID of the episode to which this video link belongs',
    type: 'number',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  episodeId: number;

  /**
   * ID of the episode to which this video link belongs
   * @type {number}
   */
  @ApiProperty({
    description: 'ID of the episode to which this video link belongs',
    type: 'number',
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  titleId: number;

  /**
   * Fake property to bind the validator
   * This property is not used but is required for the validation to work
   */
  @IsOnlyOneDefined('episodeId', 'titleId', {
    message: 'Exactly one of episodeId or titleId must be defined',
  })
  _onlyOne?: unknown; // Fake property to bind the validator
}
