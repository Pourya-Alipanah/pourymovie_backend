import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  BufferBucketNames,
  StreamBucketNames,
} from 'src/upload-center/enums/bucket-names.enum';

/**
 * DTO for uploading a file to a specific bucket in the upload center.
 * This DTO is used for both buffer and stream uploads.
 */
export class UploadBufferRequestDto {
  /**
   * The name of the bucket where the file will be uploaded.
   * This property is required and must be one of the defined bucket names.
   */
  @ApiProperty({
    description: 'The name of the bucket where the file will be uploaded',
    enum: BufferBucketNames,
    example: BufferBucketNames.AVATAR,
  })
  @IsEnum(BufferBucketNames)
  @IsNotEmpty()
  bucket: BufferBucketNames;
}

/**
 * DTO for uploading a stream to a specific bucket in the upload center.
 * This DTO is used for stream uploads.
 */
export class UploadStreamRequestDto {
  /**
   * The name of the bucket where the file will be uploaded.
   * This property is required and must be one of the defined stream bucket names.
   */
  @ApiProperty({
    description: 'The name of the bucket where the file will be uploaded',
    enum: StreamBucketNames,
    example: StreamBucketNames.TRAILER,
  })
  @IsEnum(StreamBucketNames)
  @IsNotEmpty()
  bucket: StreamBucketNames;
}
