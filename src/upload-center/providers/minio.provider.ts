import { Inject, Injectable } from '@nestjs/common';
import minioConfig from '../config/minio.config';
import { ConfigType } from '@nestjs/config';
import { Client } from 'minio';
import { createReadStream, statSync } from 'fs';
import { Readable } from 'stream';

@Injectable()
export class MinioProvider {
  private readonly client: Client;

  constructor(
    @Inject(minioConfig.KEY)
    private readonly minioConfiguration: ConfigType<typeof minioConfig>,
  ) {
    this.client = new Client({
      endPoint: this.minioConfiguration.endPoint,
      port: this.minioConfiguration.port,
      useSSL: this.minioConfiguration.useSSL,
      accessKey: this.minioConfiguration.accessKey,
      secretKey: this.minioConfiguration.secretKey,
    });
  }

  getClient(): Client {
    return this.client;
  }

  async ensureBucket(bucket: string) {
    const exists = await this.client.bucketExists(bucket);
    if (!exists) {
      await this.client.makeBucket(bucket, 'us-east-1');
    }
  }

  async generatePresignedUrl(
    bucket: string,
    objectName: string,
    expires = 300,
  ) {
    await this.ensureBucket(bucket);
    return this.client.presignedPutObject(bucket, objectName, expires);
  }

  async removeObject(bucket: string, objectName: string) {
    return this.client.removeObject(bucket, objectName);
  }

  async statObject(bucket: string, objectName: string) {
    return this.client.statObject(bucket, objectName);
  }

  async getObjectUrl(bucket: string, objectName: string, expires = 3600) {
    return this.client.presignedGetObject(bucket, objectName, expires);
  }

  async objectExists(bucket: string, objectName: string): Promise<boolean> {
    try {
      await this.client.statObject(bucket, objectName);
      return true;
    } catch (err) {
      if (err.code === 'NotFound') return false;
      throw err;
    }
  }

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
