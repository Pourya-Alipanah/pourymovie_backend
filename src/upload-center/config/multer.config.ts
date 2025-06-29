import { diskStorage } from 'multer';
import { extname, join } from 'path';

/**
 * Configuration for Multer disk storage.
 */
const uploadDir = join(
  process.cwd(),
  process.env.MINIO_TEMP_UPLOAD_DIR || 'temp-uploads',
);
/**
 * Disk storage configuration for Multer.
 * Stores uploaded files in a specified directory with a unique filename.
 */
export const multerDiskStorage = diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});
