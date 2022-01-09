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
import { get } from 'lodash';
import AdminsService from './admins.service';
import AdminSignInDto from './dto/admin-sign-in.dto';
import CreateAdminDto from './dto/create-admin.dto';
import GetAdminDetailDto from './dto/get-admin-detail.dto';
import GetAllAdminsDto from './dto/get-all-admins.dto';
import GetAllClassesDto from './dto/get-all-classes.dto';
import GetAllUsersDto from './dto/get-all-user.dto';
import GetClassDetailDto from './dto/get-class-detail.dto';
import GetUserDetailDto from './dto/get-user-detail.dto';
import MapStudentIdDto from './dto/map-student-id.dto';

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

  @Get('users/all')
  async getAllUsers(@Query() dto: GetAllUsersDto) {
    return this.adminsService.getAllUsers(dto);
  }

  @Get('users/detail')
  async getUserDetail(@Query() dto: GetUserDetailDto) {
    return this.adminsService.getUserDetail(dto);
  }

  @Post('users/map-student-id')
  async mapStudentId(@Body() MapStudentIdDto) {
    return this.adminsService.mapStudentId(MapStudentIdDto);
  }

  @Post('users/lock')
  async lockUser(@Body() LockUserDto) {
    return this.adminsService.lockUser(LockUserDto);
  }

  @Get('classes/all')
  async getAllClasses(@Query() dto: GetAllClassesDto) {
    return this.adminsService.getAllClasses(dto);
  }

  @Get('classes/detail')
  async getClassDetail(@Query() dto: GetClassDetailDto) {
    return this.adminsService.getClassDetail(dto);
  }
}
