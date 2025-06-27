import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import {
  BufferBucketNames,
  StreamBucketNames,
} from 'src/upload-center/enums/bucket-names.enum';

export class UploadBufferRequestDto {
  @ApiProperty({
    description: 'The name of the bucket where the file will be uploaded',
    enum: BufferBucketNames,
    example: BufferBucketNames.AVATAR,
  })
  @IsEnum(BufferBucketNames)
  @IsNotEmpty()
  bucket: BufferBucketNames;
}

export class UploadStreamRequestDto {
  @ApiProperty({
    description: 'The name of the bucket where the file will be uploaded',
    enum: StreamBucketNames,
    example: StreamBucketNames.TRAILER,
  })
  @IsEnum(StreamBucketNames)
  @IsNotEmpty()
  bucket: StreamBucketNames;
}
