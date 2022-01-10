import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AdminsService from './admins.service';
import AdminSignInDto from './dto/admin-sign-in.dto';
import CreateAdminDto from './dto/create-admin.dto';
import GetAdminDetailDto from './dto/get-admin-detail.dto';
import GetAllAdminsDto from './dto/get-all-admins.dto';
import GetAllClassesDto from './dto/get-all-classes.dto';
import GetAllUsersDto from './dto/get-all-user.dto';
import GetClassDetailDto from './dto/get-class-detail.dto';
import GetClassesOfUserDto from './dto/get-classes-of-user.dto';
import GetUserDetailDto from './dto/get-user-detail.dto';
import AdminAccessGuard from './guards/admin-access.guard';

@ApiTags('Admins')
@UseInterceptors(WrapResponseInterceptor)
@Controller('admins')
export default class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('sign-in')
  async signIn(@Body() dto: AdminSignInDto) {
    return this.adminsService.signIn(dto);
  }

  @UseGuards(AdminAccessGuard)
  @Post('new')
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminsService.createAdmin(dto);
  }

  @UseGuards(AdminAccessGuard)
  @Get('all')
  async getAllAdmins(@Query() dto: GetAllAdminsDto) {
    return this.adminsService.getAllAdmins(dto);
  }

  @UseGuards(AdminAccessGuard)
  @Get('detail')
  async getAdminDetail(@Query() dto: GetAdminDetailDto) {
    return this.adminsService.getAdminDetail(dto);
  }

  @UseGuards(AdminAccessGuard)
  @Get('users/all')
  async getAllUsers(@Query() dto: GetAllUsersDto) {
    return this.adminsService.getAllUsers(dto);
  }

  @UseGuards(AdminAccessGuard)
  @Get('users/detail')
  async getUserDetail(@Query() dto: GetUserDetailDto) {
    return this.adminsService.getUserDetail(dto);
  }

  @UseGuards(AdminAccessGuard)
  @Post('users/map-student-id')
  async mapStudentId(@Body() MapStudentIdDto) {
    return this.adminsService.mapStudentId(MapStudentIdDto);
  }

  @UseGuards(AdminAccessGuard)
  @Post('users/lock')
  async lockUser(@Body() LockUserDto) {
    return this.adminsService.lockUser(LockUserDto);
  }

  @UseGuards(AdminAccessGuard)
  @Get('classes/all')
  async getAllClasses(@Query() dto: GetAllClassesDto) {
    return this.adminsService.getAllClasses(dto);
  }

  @UseGuards(AdminAccessGuard)
  @Get('classes/detail')
  async getClassDetail(@Query() dto: GetClassDetailDto) {
    return this.adminsService.getClassDetail(dto);
  }

  // @UseGuards(AdminAccessGuard)
  @Get('user/classes')
  async getClassesOfUser(@Query() dto: GetClassesOfUserDto) {
    return this.adminsService.getClassesOfUser(dto);
  }
}
