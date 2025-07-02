import { Inject, Injectable } from '@nestjs/common';
import minioConfig from '../config/minio.config';
import { ConfigType } from '@nestjs/config';
import { Client } from 'minio';
import { Readable } from 'stream';
import { PublicBucketNames } from '../enums/bucket-names.enum';

/**
 * Provider for interacting with MinIO storage.
 * Provides methods for uploading, downloading, and managing files in MinIO buckets.
 */
@Injectable()
export class MinioProvider {
  /**
   * MinIO client instance for interacting with the MinIO server.
   */
  private readonly client: Client;

  /**
   * Initializes the MinIO client with configuration parameters.
   *
   * @param minioConfiguration - Configuration for connecting to the MinIO server.
   */
  constructor(
    @Inject(minioConfig.KEY)
    private readonly minioConfiguration: ConfigType<typeof minioConfig>,
  ) {
    this.makeAllPublicBucketsPublic();
    this.client = new Client({
      endPoint: this.minioConfiguration.endPoint,
      port: this.minioConfiguration.port,
      useSSL: this.minioConfiguration.useSSL,
      accessKey: this.minioConfiguration.accessKey,
      secretKey: this.minioConfiguration.secretKey,
    });
  }

  async makeAllPublicBucketsPublic() {
    for (const bucket of Object.values(PublicBucketNames)) {
      await this.ensureBucket(bucket);
      await this.makeBucketPublic(bucket);
    }
  }

  /**
   * Returns the MinIO client instance.
   *
   * @returns The MinIO client.
   */
  getClient(): Client {
    return this.client;
  }

  async makeBucketPublic(bucket: PublicBucketNames) {
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucket}/*`],
        },
      ],
    };

    await this.client.setBucketPolicy(bucket, JSON.stringify(policy));
  }

  /**
   * Ensures that the specified bucket exists in MinIO.
   * If the bucket does not exist, it creates a new bucket.
   *
   * @param bucket - The name of the bucket to ensure.
   */
  async ensureBucket(bucket: string) {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket, 'us-east-1');
    }
  }

  public getPublicUrl(bucket: string, objectName: string): string {
    const protocol = this.minioConfiguration.useSSL ? 'https' : 'http';
    return `${protocol}://${this.minioConfiguration.endPoint}:${this.minioConfiguration.port}/${bucket}/${objectName}`;
  }

  /**
   * Generates a presigned URL for uploading an object to a specified bucket.
   *
   * @param bucket - The name of the bucket.
   * @param objectName - The name of the object to upload.
   * @param expires - The expiration time for the presigned URL in seconds (default is 300 seconds).
   * @returns A presigned URL for uploading the object.
   */
  async generatePresignedUrl(
    bucket: string,
    objectName: string,
    expires = 300,
  ) {
    await this.ensureBucket(bucket);
    if (
      Object.values(PublicBucketNames).includes(bucket as PublicBucketNames)
    ) {
      return this.getPublicUrl(bucket, objectName);
    }
    return this.client.presignedPutObject(bucket, objectName, expires);
  }

  /**
   * Removes an object from a specified bucket in MinIO.
   * @param bucket - The name of the bucket.
   * @param objectName - The name of the object to remove.
   * @return A promise that resolves when the object is removed.
   */
  async removeObject(bucket: string, objectName: string) {
    return this.client.removeObject(bucket, objectName);
  }

  /**
   * Retrieves the metadata of an object in a specified bucket.
   *
   * @param bucket - The name of the bucket.
   * @param objectName - The name of the object to retrieve metadata for.
   * @returns Metadata of the specified object.
   */
  async statObject(bucket: string, objectName: string) {
    return this.client.statObject(bucket, objectName);
  }

  /**
   * Generates a presigned URL for downloading an object from a specified bucket.
   *
   * @param bucket - The name of the bucket.
   * @param objectName - The name of the object to download.
   * @param permanet - If true, generates a permanent URL (default is false).
   * @param expires - The expiration time for the presigned URL in seconds (default is 3600 seconds).
   * @returns A presigned URL for downloading the object.
   */
  async getObjectUrl(
    bucket: string,
    objectName: string,
    permanet: boolean,
    expires = 3600,
  ) {
    const expireTime = permanet ? 60 * 60 * 24 * 7 : expires; // 7 days for one week, otherwise use the provided expiration
    return this.client.presignedGetObject(bucket, objectName, expireTime);
  }

  /**
   * Checks if an object exists in a specified bucket.
   *
   * @param bucket - The name of the bucket.
   * @param objectName - The name of the object to check.
   * @returns A promise that resolves to true if the object exists, false otherwise.
   */
  async objectExists(bucket: string, objectName: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, objectName);
      return true;
    } catch (err) {
      if (err.code === 'NotFound') return false;
      throw err;
    }
  }

  /**
   * Uploads a buffer to a specified bucket in MinIO.
   *
   * @param bucket - The name of the bucket.
   * @param objectName - The name of the object to upload.
   * @param buffer - The buffer containing the file data.
   * @param mimeType - The MIME type of the file.
   * @returns A promise that resolves when the upload is complete.
   */
  async uploadBuffer(
    bucket: string,
    objectName: string,
    buffer: Buffer,
    mimeType: string,
  ) {
    await this.ensureBucket(bucket);
    return this.client.putObject(bucket, objectName, buffer, buffer.length, {
      'Content-Type': mimeType,
    });
  }

  /**
   * Uploads a stream to a specified bucket in MinIO.
   *
   * @param bucket - The name of the bucket.
   * @param objectName - The name of the object to upload.
   * @param input - The input stream or buffer to upload.
   * @param size - The size of the input data.
   * @param mimeType - The MIME type of the file.
   * @returns A promise that resolves when the upload is complete.
   */
  async uploadStream(
    bucket: string,
    objectName: string,
    input: Buffer | Readable,
    size: number,
    mimeType: string,
  ) {
    await this.ensureBucket(bucket);

    const stream = Buffer.isBuffer(input) ? Readable.from(input) : input;

    try {
      const result = await this.client.putObject(
        bucket,
        objectName,
        stream,
        size,
        {
          'Content-Type': mimeType,
        },
      );
      return result;
    } catch (err) {
      throw new Error(`Upload to MinIO failed: ${err.message}`);
    }
  }
}
