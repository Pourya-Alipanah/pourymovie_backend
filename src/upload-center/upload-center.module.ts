import { Module } from '@nestjs/common';
import { UploadCenterController } from './upload-center.controller';
import { UploadCenterService } from './providers/upload-center.service';
import { MinioProvider } from './providers/minio.provider';
import { ConfigModule, ConfigType } from '@nestjs/config';
import minioConfig from './config/minio.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadCenter } from './upload-center.entity';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [UploadCenterController],
  providers: [UploadCenterService, MinioProvider],
  imports: [
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
})
export class UploadCenterModule {}
