import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from './quards/jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { authConfig } from './auth.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [AuthService, JwtAuthGuard, JwtStrategy],
  exports: [PassportModule, JwtAuthGuard],
  imports: [
    HttpModule,
    ConfigModule.forFeature(authConfig),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    UserModule,
  ],
})
export class AuthModule {}
