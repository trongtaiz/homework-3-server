import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AdminsService from './admins.service';
import AdminSignInDto from './dto/admin-sign-in.dto';
import CreateAdminDto from './dto/create-admin.dto';

@ApiTags('Admins')
@UseInterceptors(WrapResponseInterceptor)
@Controller('admins')
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('sign-in')
  async signIn(@Body() dto: AdminSignInDto) {
    return this.adminsService.signIn(dto);
  }

  @Post('new')
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminsService.createAdmin(dto);
  }
}
