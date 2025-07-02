import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import {
  BufferBucketNames,
  StreamBucketNames,
} from 'src/upload-center/enums/bucket-names.enum';

/**
 * ConfirmUploadRequestDto
 * @description Data Transfer Object for confirming file upload.
 * Validates the input data for confirming a file upload.
 */
export class ConfirmUploadRequestDto {
  /**
   * Data Transfer Object for confirming file upload.
   * Validates the input data for confirming a file upload.
   */
  @ApiProperty({
    description: 'The bucket name where the file is stored',
    enum: { ...BufferBucketNames, ...StreamBucketNames },
    example: BufferBucketNames.AVATAR,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum({ ...BufferBucketNames, ...StreamBucketNames })
  bucket: BufferBucketNames | StreamBucketNames;

  /**
   * The key of the file in the storage system.
   * Must be a non-empty string.
   */
  @ApiProperty({
    description: 'The key of the file in the storage system',
    example: 'file-key-12345',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  key: string;
}
