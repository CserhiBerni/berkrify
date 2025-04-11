import { Controller, Get, Render, UseGuards, Post} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Post('newSong')
  @Roles(Role.Admin, Role.User)
  @UseGuards(AuthGuard('bearer'), RolesGuard)
  newSong() {
    return "New song successfully added"
  }
}
