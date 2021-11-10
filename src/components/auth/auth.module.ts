import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import LocalStrategy from './strategies/local.strategy';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import JwtRefreshStrategy from './strategies/jwt-refresh.strategy';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import UsersModule from '@components/user/users.module';
@Module({
  imports: [
    UsersModule,
    PassportModule,    
    JwtModule.register({}),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export default class AuthModule {}
