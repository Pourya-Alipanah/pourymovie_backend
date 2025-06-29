import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for the response of an upload operation in the upload center.
 */
export class UploadResponseDto {
  /**
   * The URL of the uploaded file.
   */
  @ApiProperty({
    description: 'The URL of the uploaded file',
    example: 'https://example.com/path/to/uploaded/file.png',
  })
  url: string;
  /**
   * The key of the uploaded file in the storage bucket.
   */
  @ApiProperty({
    description: 'The key of the uploaded file in the storage bucket',
    example: 'uploads/2023/10/01/file.png',
  })
  key: string;
}
