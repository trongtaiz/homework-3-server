import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  Req,
  Get,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import LocalAuthGuard from './guards/local-auth.guard';
import AuthService from './auth.service';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import { JwtTokenPayload } from './interfaces/jwt-token-payload.interface';
import JwtRefreshGuard from '@guards/jwt-refresh.guard';
import UserEntity from '@components/users/entities/users.entity';
import { AuthGuard } from '@nestjs/passport';
import AuthUser from '@decorators/auth-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignInDto })
  @ApiBearerAuth()
  @UseInterceptors(WrapResponseInterceptor)
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req: ExpressRequest) {
    const user = req.user as UserEntity;

    return this.authService.login(user);
  }

  @ApiBody({ type: SignUpDto })
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(WrapResponseInterceptor)
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @UseInterceptors(WrapResponseInterceptor)
  @Post('refresh-token')
  async refreshToken(@Request() req: ExpressRequest) {
    const { jwtTokenPayload, refreshToken } = req.user as {
      jwtTokenPayload: JwtTokenPayload;
      refreshToken: string;
    };

    return this.authService.refreshToken(jwtTokenPayload, refreshToken);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('sign-out')
  async signOut(@Request() req: ExpressRequest) {
    const { jwtTokenPayload, refreshToken } = req.user as {
      jwtTokenPayload: JwtTokenPayload;
      refreshToken: string;
    };

    return this.authService.signOut(jwtTokenPayload, refreshToken);
  }

  @ApiQuery({ name: 'access_token' })
  @Get('facebook/token')
  @UseGuards(AuthGuard('facebook-token'))
  async facebookLoginByToken(@AuthUser() user: UserEntity) {
    Logger.debug('facebook/token');
    return this.authService.login(user);
  }

  @ApiQuery({ name: 'access_token' })
  @Get('google/token')
  @UseGuards(AuthGuard('google-token'))
  async googleLoginByToken(@AuthUser() user: UserEntity) {
    Logger.debug('google/token');
    return this.authService.login(user);
  }
}
