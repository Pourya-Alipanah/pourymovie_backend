import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadCenterService } from './providers/upload-center.service';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  UploadBufferRequestDto,
  UploadStreamRequestDto,
} from './dtos/request/upload.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ApiSingleResponse } from 'src/common/decorators/single-response.decorator';
import { UploadResponseDto } from './dtos/response/upload.dto';
import { Role } from 'src/auth/decorators/role.decorator';
import { UserRole } from 'src/user/enums/user-role.enum';
import { multerDiskStorage } from './config/multer.config';

/**
 * Controller for managing file uploads in the upload center.
 * Provides endpoints for uploading files as buffers or streams,
 */
@Controller({ version: '1', path: 'upload-center' })
export class UploadCenterController {
  /**
   * Initializes the upload center controller.
   * Injects the UploadCenterService to handle file uploads.
   *
   * @param uploadCenterService - Service for managing file uploads.
   */
  constructor(private readonly uploadCenterService: UploadCenterService) {}

  /**
   * Uploads a file as a buffer to the specified MinIO bucket.
   * Generates a unique object name based on the original file name and current timestamp.
   *
   * @param file - The file to upload, provided by Multer.
   * @param bucket - The bucket to upload the file to.
   * @returns An object containing the file key and URL of the uploaded file.
   */
  @ApiOperation({
    summary: 'Upload a file as a buffer',
    description: 'Uploads a file to the specified bucket using a buffer.',
  })
  @Post('buffer')
  @UseInterceptors(FileInterceptor('file'))
  @ApiSingleResponse(UploadResponseDto)
  @ApiBearerAuth('access-token')
  public async uploadBuffer(
    @UploadedFile() file: Express.Multer.File,
    @Body() { bucket }: UploadBufferRequestDto,
  ) {
    return this.uploadCenterService.withBuffer(file, bucket);
  }

  /**
   * Uploads a file as a stream to the specified MinIO bucket.
   * Generates a unique object name based on the original file name and current timestamp.
   *
   * @param file - The file to upload, provided by Multer.
   * @param bucket - The bucket to upload the file to.
   * @returns An object containing the file key and URL of the uploaded file.
   */
  @Post('stream')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerDiskStorage,
    }),
  )
  async uploadLargeFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() { bucket }: UploadStreamRequestDto,
  ) {
    return this.uploadCenterService.withStream(file, bucket);
  }
}
