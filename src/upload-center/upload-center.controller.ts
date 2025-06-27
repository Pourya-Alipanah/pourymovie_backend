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

@Controller({ version: '1', path: 'upload-center' })
export class UploadCenterController {
  constructor(private readonly uploadCenterService: UploadCenterService) {}

  @ApiOperation({
    summary: 'Upload a file as a buffer',
    description: 'Uploads a file to the specified bucket using a buffer.',
  })
  @Post('buffer')
  @UseInterceptors(FileInterceptor('file'))
  @ApiSingleResponse(UploadResponseDto)
  @ApiBearerAuth('access-token')
  @Role(UserRole.ADMIN)
  public async uploadBuffer(
    @UploadedFile() file: Express.Multer.File,
    @Body() { bucket }: UploadBufferRequestDto,
  ) {
    return this.uploadCenterService.withBuffer(file, bucket);
  }

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
