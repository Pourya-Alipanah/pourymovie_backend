import { Global, Module } from '@nestjs/common';
import { UploadCenterController } from './upload-center.controller';
import { UploadCenterService } from './providers/upload-center.service';
import { MinioProvider } from './providers/minio.provider';
import { ConfigModule, ConfigType } from '@nestjs/config';
import minioConfig from './config/minio.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadCenter } from './upload-center.entity';
import { MulterModule } from '@nestjs/platform-express';
import { CleanUpProvider } from './providers/clean-up.provider';
import { ScheduleModule } from '@nestjs/schedule';

/**
 * Module for managing file uploads in the upload center.
 * Provides endpoints for uploading files as buffers or streams,
 */
@Global()
@Module({
  controllers: [UploadCenterController],
  providers: [UploadCenterService, MinioProvider, CleanUpProvider],
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forFeature(minioConfig),
    TypeOrmModule.forFeature([UploadCenter]),
    MulterModule.registerAsync({
      imports: [ConfigModule, ConfigModule.forFeature(minioConfig)],
      inject: [minioConfig.KEY],
      useFactory: (minioConf: ConfigType<typeof minioConfig>) => {
        return {
          limits: {
            fileSize: minioConf.maxFileUploadInBytes,
          },
        };
      },
    }),
  ],
  exports:[UploadCenterService]
})
export class UploadCenterModule {}
