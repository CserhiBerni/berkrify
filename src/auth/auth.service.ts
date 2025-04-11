import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from '../user/dto/login-dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService
  ) {}

  async login(loginData: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email: loginData.email }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await argon2.verify(user.password, loginData.password);
      
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = randomBytes(32).toString('hex');
      
      await this.prisma.token.create({
        data: {
          token,
          userId: user.id,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      });

      const { password, ...userWithoutPassword } = user;
      
      return {
        access_token: token,
        user: userWithoutPassword
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new UnauthorizedException('Login failed');
    }
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new UnauthorizedException('Email already in use');
      }

      let userRole = createUserDto.role;
      
      if (!userRole) {
        userRole = Role.User;
      } else if (typeof userRole === 'string') {
        userRole = userRole === 'Admin' ? Role.Admin : Role.User;
      }

      const newUser = await this.userService.create({
        ...createUserDto,
        created: new Date(),
        role: userRole
      });

      const token = randomBytes(32).toString('hex');
      
      await this.prisma.token.create({
        data: {
          token,
          userId: newUser.id,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }
      });
      
      return {
        access_token: token,
        user: newUser
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw new UnauthorizedException('Registration failed: ' + error.message);
    }
  }
}