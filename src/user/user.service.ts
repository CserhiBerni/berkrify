import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login-dto';
import { randomBytes } from 'node:crypto';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {

  constructor(private readonly db: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPw = await argon2.hash(createUserDto.password);
    const role = createUserDto.role || Role.User;

    const userData = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPw,
      role: role,
      created: createUserDto.created || new Date()
    };
    
    const newUser = await this.db.user.create({
      data: userData
    });

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async login(loginData: LoginDto) {
    const user = await this.db.user.findUniqueOrThrow({
      where: {
        email: loginData.email
      }
    });
    if (await argon2.verify(await user.password, loginData.password)) {
      const token = randomBytes(32).toString('hex');
      await this.db.token.create({
        data: {
          token,
          user: {
            connect: { id: user.id }
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      })
      return {
        token: token,
        userId: user.id,
      }
    } else {
      throw new Error('Invalid password');
    }
  }

  async findAll() {
    const users = await this.db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        created: true,
        profilePicture: true,
        role: true
      }
    });
    return users;
  }

  async findOne(id: number) {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true, 
        email: true,
        created: true,
        profilePicture: true,
        role: true
      }
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const currentUser = await this.db.user.findUnique({
      where: { id },
      select: { profilePicture: true }
    });
    
    if (!currentUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updateData: any = {};
    
    if (updateUserDto.name) {
      updateData.name = updateUserDto.name;
    }
    
    if (updateUserDto.profilePicture) {
      updateData.profilePicture = updateUserDto.profilePicture;
    }
    
    if (updateUserDto.password) {
      updateData.password = await argon2.hash(updateUserDto.password);
    }
    
    const updatedUser = await this.db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        created: true,
        profilePicture: true,
        role: true
      }
    });
    
    return updatedUser;
  }

  async remove(id: number) {
    await this.db.user.delete({ where: { id } });
    return { success: true };
  }

  async findUserByToken(token: string) {
    const tokenData = await this.db.token.findUnique({
      where: { token },
      include: { user: true }
    })
    if (!tokenData) return null;
    const user = tokenData.user;
    delete user.password;
    
    return user;
  }
}