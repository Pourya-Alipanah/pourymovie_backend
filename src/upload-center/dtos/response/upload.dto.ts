import { ApiProperty } from '@nestjs/swagger';
import {
  BufferBucketNames,
  StreamBucketNames,
} from 'src/upload-center/enums/bucket-names.enum';

/**
 * DTO for the response of an upload operation in the upload center.
 */
export class UploadResponseDto {
  /**
   * The URL of the uploaded file.
   */
  @ApiProperty({
    description: 'bucket name of the uploaded file',
    example: BufferBucketNames.AVATAR,
    enum: { ...BufferBucketNames, ...StreamBucketNames },
  })
  bucket: BufferBucketNames | StreamBucketNames;
  /**
   * The key of the uploaded file in the storage bucket.
   */
  @ApiProperty({
    description: 'The key of the uploaded file in the storage bucket',
    example: 'uploads/2023/10/01/file.png',
  })
  key: string;
}
