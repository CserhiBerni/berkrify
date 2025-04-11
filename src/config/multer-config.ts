import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      let folder = 'uploads/covers';
      
      if (file.mimetype.startsWith('audio/')) {
        folder = 'uploads/mp3';
      } else if (req.url.includes('playlist-cover')) {
        folder = 'uploads/playlistcovers';
      } else if (req.url.includes('profile')) {
        folder = 'uploads/profiles';
      }
      
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      
      cb(null, folder);
    },
    filename: (req, file, cb) => {
      let prefix = '';
      
      if (req.url.includes('playlist-cover')) {
        prefix = 'playlist-';
      } else if (req.url.includes('profile')) {
        prefix = 'profile-';
      }
      
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
    },
  }),
};