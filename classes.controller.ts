import AuthUser from '@decorators/auth-user.decorator';
import JwtAccessGuard from '@guards/jwt-access.guard';
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

  @Get('/mapStudentId/')
  mapStudentId(
    @Query('classId') classId,
    @Query('userId') userId,
    @Query('studentId') studentId,
  ) {
    console.log('query', classId, userId, studentId);
    return this.classesService.mapStudentId(classId, userId, studentId);
  }
  @UseGuards(JwtAccessGuard)
  @Post('/')
  createClass(@AuthUser() user: any, @Body() createClassDto: CreateClassDto) {
    // get user id from jwt
    return this.classesService.createClass(user.id, createClassDto);
  }

  @Get('/all')
  getAllClasses() {
    return this.classesService.getAllClasses();
  }

  @UseGuards(JwtAccessGuard)
  @Get('/join-class') // ?inviteId=...&?classId=...
  joinClass(@AuthUser() user: any, @Query() query) {
    const { inviteId, classId } = query;
    // need to get student id from jwt
    return this.classesService.joinClass({
      studentId: user.id,
      classId,
      inviteId,
    });
  }

  @UseGuards(JwtAccessGuard)
  @Get('/teacher-join/:token')
  assignTeacher(@AuthUser() user: any, @Param('token') token: string) {
    // need to get teacher id from jwt
    return this.classesService.assignTeacher(token, user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Get('/send-email')
  sendInvitationEmail(
    @AuthUser() user: any,
    @Body() sendInvitationDto: SendInvitationDto,
  ) {
    // get user id from jwt
    return this.classesService.sendEmailInviteTeacher(
      user.id,
      sendInvitationDto,
    );
  }
}
