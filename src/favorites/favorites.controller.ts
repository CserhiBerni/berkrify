import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('favorites')
@UseGuards(TokenAuthGuard, RolesGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create(@Body() createFavoriteDto: CreateFavoriteDto, @Request() req) {
    createFavoriteDto.user_id = req.user.id;
    return this.favoritesService.create(createFavoriteDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.favoritesService.findByUserId(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFavoriteDto: UpdateFavoriteDto) {
    return this.favoritesService.update(+id, updateFavoriteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(+id);
  }

  @Delete('song/:id')
  removeBySong(@Param('id') id: string, @Request() req) {
    return this.favoritesService.removeBySongAndUser(+id, req.user.id);
  }

  @Get('admin/all')
  @Roles('Admin')
  findAllForAdmin() {
    return this.favoritesService.findAll();
  }
}
