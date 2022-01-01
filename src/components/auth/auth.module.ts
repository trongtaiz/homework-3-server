import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import LocalStrategy from './strategies/local.strategy';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import JwtRefreshStrategy from './strategies/jwt-refresh.strategy';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import UsersModule from '@components/users/users.module';
import AuthEntity from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import FacebookTokenStrategy from './strategies/facebook-token.stategy';
import GoogleTokenStrategy from './strategies/google-token.strategy';
import UserEntity from '@components/users/entities/users.entity';
import { MailModule } from '@utils/mail.util';
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
    MailModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    FacebookTokenStrategy,
    GoogleTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export default class AuthModule {}
