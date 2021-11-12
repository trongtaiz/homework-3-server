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
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import LocalAuthGuard from './guards/local-auth.guard';
import AuthService from './auth.service';
import SignInDto from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up.dto';
import { JwtTokenPayload } from './interfaces/jwt-token-payload.interface';
import JwtRefreshGuard from '@guards/jwt-refresh.guard';

@ApiTags('Auth')
@UseInterceptors(WrapResponseInterceptor)
@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignInDto })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req: ExpressRequest) {
    const user = req.user as JwtTokenPayload;

    return this.authService.login(user);
  }

  @ApiBody({ type: SignUpDto })
  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh-token')
  async refreshToken(@Request() req: ExpressRequest) {
    const { jwtTokenPayload, refreshToken } = req.user as {
      jwtTokenPayload: JwtTokenPayload;
      refreshToken: string;
    };

    return this.authService.refreshToken(jwtTokenPayload, refreshToken);
  }
}
