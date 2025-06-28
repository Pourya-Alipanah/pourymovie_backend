import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { MinioProvider } from './minio.provider';
import {
  BufferBucketNames,
  StreamBucketNames,
} from '../enums/bucket-names.enum';
import { basename, extname, join } from 'path';
import slugify from 'slugify';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  statSync,
  unlinkSync,
} from 'fs';
import minioConfig from '../config/minio.config';
import { ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadCenter } from '../upload-center.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UploadCenterService implements OnModuleInit {
  constructor(
    @Inject(minioConfig.KEY)
    private readonly minioConfiguration: ConfigType<typeof minioConfig>,
    private readonly minioProvider: MinioProvider,
    @InjectRepository(UploadCenter)
    private readonly uploadRepository: Repository<UploadCenter>,
  ) {}

  onModuleInit() {
    const dir = this.minioConfiguration.tempUploadDir;
    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  public async withBuffer(
    file: Express.Multer.File,
    bucket: BufferBucketNames,
  ) {
    const originalName = basename(file.originalname);
    const extension = extname(originalName);
    const nameWithoutExt = originalName.replace(extension, '');

    const safeName = slugify(nameWithoutExt, {
      lower: true,
      strict: true,
    });

    const objectName = `${Date.now()}-${safeName}${extension}`;

    await this.minioProvider.uploadBuffer(
      bucket,
      objectName,
      file.buffer,
      file.mimetype,
    );
    const url = await this.minioProvider.getObjectUrl(
      bucket,
      objectName,
      60 * this.minioConfiguration.urlExpirationMinutes,
    );
    const uploadTransaction = this.uploadRepository.create({
      fileKey: objectName,
      bucket,
    });

    await this.uploadRepository.save(uploadTransaction);
    return {
      key: objectName,
      url,
    };
  }

  public async withStream(
    file: Express.Multer.File,
    bucket: StreamBucketNames,
  ) {
    const originalName = basename(file.originalname);
    const extension = extname(originalName);
    const nameWithoutExt = originalName.replace(extension, '');

    const safeName = slugify(nameWithoutExt, {
      lower: true,
      strict: true,
    });

    const objectName = `${Date.now()}-${safeName}${extension}`;

    try {
      const stream = createReadStream(file.path);
      const size = statSync(file.path).size;

      await this.minioProvider.uploadStream(
        bucket,
        objectName,
        stream,
        size,
        file.mimetype,
      );

      unlinkSync(file.path);

      const url = await this.minioProvider.getObjectUrl(
        bucket,
        objectName,
        60 * this.minioConfiguration.urlExpirationMinutes,
      );

      const uploadTransaction = this.uploadRepository.create({
        fileKey: objectName,
        bucket,
      });

      await this.uploadRepository.save(uploadTransaction);

      return {
        key: objectName,
        url,
      };
    } catch (error) {
      if (file.path && existsSync(file.path)) {
        unlinkSync(file.path);
      }
      throw error;
    }
  }
}
