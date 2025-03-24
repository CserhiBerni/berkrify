import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const folder = file.mimetype.startsWith('audio/') ? 'uploads/mp3' : 'uploads/covers';
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
};
