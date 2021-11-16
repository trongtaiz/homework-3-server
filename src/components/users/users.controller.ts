import AuthUser from '@decorators/auth-user.decorator';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UsersService from './users.service';

@Controller('users')
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(WrapResponseInterceptor)
  @UseGuards(JwtAccessGuard)
  @Get('me')
  async getUserInfo(@AuthUser() user: any) {
    return this.usersService.getUserInfo(user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Put()
  async editProfile(@AuthUser() user: any) {
    return this.usersService;
  }
}
