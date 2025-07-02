import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
import { UploadFromEntity } from '../enums/upload-from-entity.enum';
import { UploadType } from '../enums/upload-type.enum';
import { UPLOAD_RECORD_NOT_FOUND } from '../constants/upload-center.errors.contant';
import { UploadStatus } from '../enums/upload-status.enum';

/**
 * Service for managing file uploads in the upload center.
 * Handles both buffer and stream uploads to MinIO,
 * and provides methods for confirming and removing uploads.
 */
@Injectable()
export class UploadCenterService implements OnModuleInit {
  /**
   * Initializes the upload center service.
   * Ensures the temporary upload directory exists.
   *
   * @param minioConfiguration - Configuration for MinIO.
   * @param minioProvider - Provider for MinIO operations.
   * @param uploadRepository - Repository for managing upload records.
   */
  constructor(
    @Inject(minioConfig.KEY)
    private readonly minioConfiguration: ConfigType<typeof minioConfig>,
    private readonly minioProvider: MinioProvider,
    @InjectRepository(UploadCenter)
    private readonly uploadRepository: Repository<UploadCenter>,
  ) {}

  /**
   * Ensures the temporary upload directory exists on module initialization.
   * Creates the directory if it does not exist.
   */
  onModuleInit() {
    const dir = this.minioConfiguration.tempUploadDir;
    if (dir && !existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Uploads a file as a buffer to the specified MinIO bucket.
   * Generates a unique object name based on the original file name and current timestamp.
   *
   * @param file - The file to upload, provided by Multer.
   * @param bucket - The bucket to upload the file to.
   * @returns An object containing the file key and URL of the uploaded file.
   */
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
    const url = await this.minioProvider.getObjectUrl(bucket, objectName, true);
    const uploadTransaction = this.uploadRepository.create({
      fileKey: objectName,
      bucket,
    });

    await this.uploadRepository.save(uploadTransaction);
    return {
      bucket,
      key: objectName,
      url,
    };
  }

  /**
   * Uploads a file as a stream to the specified MinIO bucket.
   * Generates a unique object name based on the original file name and current timestamp.
   *
   * @param file - The file to upload, provided by Multer.
   * @param bucket - The bucket to upload the file to.
   * @returns An object containing the file key and URL of the uploaded file.
   */
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
        true,
      );

      const uploadTransaction = this.uploadRepository.create({
        fileKey: objectName,
        bucket,
      });

      await this.uploadRepository.save(uploadTransaction);

      return {
        bucket,
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

  /**
   * Retrieves all pending uploads from the repository.
   *
   * @returns A list of pending upload records.
   */
  public async pendingUploads() {
    return await this.uploadRepository.find({
      where: { status: UploadStatus.PENDING },
    });
  }

  /**
   * Confirms an upload by updating its status and associating it with an entity.
   *
   * @param fileKey - The unique key of the uploaded file.
   * @param entity - The entity from which the upload originated.
   * @param type - The type of upload.
   * @returns The URL of the confirmed upload.
   */
  public async confirmUpload(
    fileKey: string,
    entity: UploadFromEntity,
    type: UploadType,
  ) {
    const uploaded = await this.uploadRepository.findOneBy({ fileKey });

    if (!uploaded) {
      throw new NotFoundException(UPLOAD_RECORD_NOT_FOUND);
    }

    Object.assign(uploaded, {
      fromEntity: entity,
      type,
      status: UploadStatus.CONFIRMED,
    });
    this.uploadRepository.save(uploaded);
  }

  /**
   * Removes an upload record and deletes the corresponding file from MinIO.
   *
   * @param fileKey - The unique key of the uploaded file.
   */
  public async removeUpload(fileKey: string) {
    const uploaded = await this.uploadRepository.findOneBy({ fileKey });

    if (!uploaded) {
      return console.error(UPLOAD_RECORD_NOT_FOUND);
    }

    await this.uploadRepository.delete(uploaded.id);

    try {
      await this.minioProvider.removeObject(uploaded.bucket, uploaded.fileKey);
    } catch (error) {
      console.error('Error removing object from MinIO:', error);
    }
  }

  /**
   * Retrieves the URL of a file stored in MinIO.
   * The URL is generated based on the bucket name and file key.
   *
   * @param objectName - The full object name in the format "bucketName/fileKey".
   * @returns The URL of the file.
   */
  public async getFileUrl(objectName: string) {
    const [bucketName, fileKey] = objectName.split('/');
    return this.minioProvider.getObjectUrl(
      bucketName as StreamBucketNames,
      fileKey,
      true,
    );
  }
}
