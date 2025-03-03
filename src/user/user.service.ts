import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login-dto';
import { randomBytes } from 'node:crypto';

@Injectable()
export class UserService {

  constructor(private readonly db: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPw = await argon2.hash(createUserDto.password);
    const newUser = await this.db.user.create({
      data: {
        ...createUserDto,
        role: 'User',
        password: hashedPw,
      }
    });
    delete newUser.password;
    return newUser;
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
          }
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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

