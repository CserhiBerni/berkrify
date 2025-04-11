import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Express } from 'express';

@Injectable()
export class UploadService {
    private uploadPath = path.join(__dirname, '..', '..', 'uploads');

    constructor() {
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
        }
        
        const profilePath = path.join(this.uploadPath, 'profiles');
        if (!fs.existsSync(profilePath)) {
            fs.mkdirSync(profilePath, { recursive: true });
        }
    }

    saveFile(file: Express.Multer.File, folder: string): string {
        const filePath = path.join(this.uploadPath, folder);
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }

        const fileName = `${Date.now()}-${file.originalname}`;
        const fullPath = path.join(filePath, fileName);
        fs.writeFileSync(fullPath, file.buffer);

        return `/uploads/${folder}/${fileName}`; 
    }

    saveMp3(file: Express.Multer.File): string {
        return this.saveFile(file, 'mp3');
    }

    saveSongCover(file: Express.Multer.File): string {
        return this.saveFile(file, 'covers');
    }
    
    savePlaylistCover(file: Express.Multer.File): string {
        return this.saveFile(file, 'playlistcovers');
    }

    saveProfilePicture(file: Express.Multer.File): string {
        return this.saveFile(file, 'profiles');
    }

    deleteFile(filePath: string): boolean {
        try {
            const relativePath = filePath.replace('/uploads/', '');
            const fullPath = path.join(this.uploadPath, relativePath);
            
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting file:', error);
            return false;
        }
    }
}