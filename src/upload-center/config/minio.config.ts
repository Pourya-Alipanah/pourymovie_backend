import { registerAs } from '@nestjs/config';

export default registerAs('minioConfig', () => ({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  port: Number(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  urlExpirationMinutes: Number(process.env.MINIO_URL_EXPIRATION_MINUTES) || 15,
  maxFileUploadInBytes:
    (Number(process.env.MINIO_MAX_FILE_UPLOAD_IN_GB) || 4) * 1024 * 1024 * 1024,
  tempUploadDir: process.env.MINIO_TEMP_UPLOAD_DIR,
}));
