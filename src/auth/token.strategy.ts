import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly users: UserService) {
    super();
  }

  async validate(token: string) {
    const user = await this.users.findUserByToken(token);
    if (user) {
      return user;
    } else {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
