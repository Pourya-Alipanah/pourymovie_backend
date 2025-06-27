import { diskStorage } from 'multer';
import { extname, join } from 'path';

const uploadDir = join(
  process.cwd(),
  process.env.MINIO_TEMP_UPLOAD_DIR || 'temp-uploads',
);
export const multerDiskStorage = diskStorage({
  destination: uploadDir,
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
    callback(null, uniqueName);
  },
});
