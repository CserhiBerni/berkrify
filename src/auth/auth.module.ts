import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { TokenStrategy } from './token.strategy';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, TokenStrategy],
})
export class AuthModule {}
