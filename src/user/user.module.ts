import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, PrismaService],
})
export class UserModule {}
