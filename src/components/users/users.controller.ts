import AuthUser from '@decorators/auth-user.decorator';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import UpdateUserDto from './dto/update-user.dto';
import UsersService from './users.service';

@ApiTags('Users')
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
  async editProfile(@AuthUser() user: any, @Body() dto: UpdateUserDto) {
    const result = await this.usersService.updateUser(user.id, dto);
    if (result) return { message: 'Update successfully' };
  }
}
