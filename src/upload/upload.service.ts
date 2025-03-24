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
}
