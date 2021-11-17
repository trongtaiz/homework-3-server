import AuthUser from '@decorators/auth-user.decorator';
import JwtAccessGuard from '@guards/jwt-access.guard';
import TeacherOfClassGuard from '@guards/teacher-of-class.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/createClass.dto';
import { SendInvitationDto } from './dto/sendInvitation.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @UseGuards(JwtAccessGuard)
  @Post('/')
  createClass(@AuthUser() user: any, @Body() createClassDto: CreateClassDto) {
    return this.classesService.createClass(user.id, createClassDto);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/all')
  getAllClasses(@AuthUser() user: any) {
    return this.classesService.getAllClasses(user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/join-class') // ?inviteId=...&?classId=...
  joinClass(@AuthUser() user: any, @Query() query) {
    const { inviteId, classId } = query;
    return this.classesService.joinClass({
      studentId: user.id,
      classId,
      inviteId,
    });
  }

  @Get('/join-by-email/:token')
  assignTeacher(@Param('token') token: string) {
    return this.classesService.joinByEmail(token);
  }

  @UseGuards(JwtAccessGuard, TeacherOfClassGuard)
  @Post('/send-email')
  sendInvitationEmail(@Body() sendInvitationDto: SendInvitationDto) {
    return this.classesService.sendEmailInviteToClass(sendInvitationDto);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/students/:classId')
  getStudentsInClass(@Param() params) {
    return this.classesService.getStudentsInClass(params.classId);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/teachers/:classId')
  getTeachersInClass(@Param() params) {
    return this.classesService.getTeachersInClass(params.classId);
  }

  @Get('/changeStudentId/')
  changeStudentId(
    @Query('classId') classId,
    @Query('userId') userId,
    @Query('studentId') studentId,
  ) {
    console.log('query', classId, userId, studentId);
    return this.classesService.changeStudentId(classId, userId, studentId);
  }
  @Get('/fetchStudentId/')
  fetchStudentId(@Query('classId') classId, @Query('userId') userId) {
    console.log('query', classId, userId);
    return this.classesService.fetchStudentId(classId, userId);
  }
  @Get('/role')
  getRole(@Query('classId') classId, @Query('userId') userId) {
    console.log('query', classId, userId);
    return this.classesService.getRole(classId, userId);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/:id')
  getClassDetail(@Param() params) {
    return this.classesService.getClassDetail(params.id);
  }
}
