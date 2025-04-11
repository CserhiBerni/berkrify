import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UnauthorizedException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login-dto';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { multerConfig } from '../config/multer-config';
import { UploadService } from '../upload/upload.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly uploadService: UploadService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    try {
      return await this.userService.login(loginData);
    } catch {
      throw new UnauthorizedException("Érvénytelen név v. jelszó!")
    }
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  findAll(@Request() request) {
    console.log(request.user);
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard('bearer'))
  async getProfile(@Request() req) {
    const userId = req.user.id;
    return this.userService.findOne(userId);
  }

@Patch('profile')
@UseGuards(AuthGuard('bearer'))
@UseInterceptors(FileInterceptor('profilePicture', multerConfig))
async updateProfile(
  @Request() req,
  @Body() updateUserDto: UpdateUserDto,
  @UploadedFile() file?: Express.Multer.File
) {
  const userId = req.user.id;
  
  const updateData = { ...updateUserDto };
  
  if (file) {
    updateData.profilePicture = `/uploads/profiles/${file.filename}`;
  }
  
  return this.userService.update(userId, updateData);
}
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}