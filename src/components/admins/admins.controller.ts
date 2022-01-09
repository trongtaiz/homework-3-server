import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AdminsService from './admins.service';
import AdminSignInDto from './dto/admin-sign-in.dto';
import CreateAdminDto from './dto/create-admin.dto';
import GetAdminDetailDto from './dto/get-admin-detal.dto';
import GetAllAdminsDto from './dto/get-all-admins.dto';

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

  @Get('all')
  async getAllAdmins(@Query() dto: GetAllAdminsDto) {
    return this.adminsService.getAllAdmins(dto);
  }

  @Get('detail')
  async getAdminDetail(@Query() dto: GetAdminDetailDto) {
    return this.adminsService.getAdminDetail(dto);
  }
}
