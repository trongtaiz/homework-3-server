import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Query,
  Param,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/createClass.dto';
import { SendInvitationDto } from './dto/sendInvitation.dto';

@UseInterceptors(WrapResponseInterceptor)
@Controller('classes')
export class ClassesController {
  constructor(private classesService: ClassesService) {}

  @Post('/')
  createClass(@Body() createClassDto: CreateClassDto) {
    // get user id from jwt
    return this.classesService.createClass(1, createClassDto);
  }

  @Get('/all')
  getAllClasses() {
    return this.classesService.getAllClasses();
  }

  @Get('/join-class') // ?inviteId=...&?classId=...
  joinClass(@Query() query) {
    const { inviteId, classId } = query;
    // need to get student id from jwt
    return this.classesService.joinClass({ studentId: 2, classId, inviteId });
  }

  @Get('/teacher-join/:token')
  assignTeacher(@Param('token') token) {
    // need to get teacher id from jwt
    return this.classesService.assignTeacher(token, 2);
  }

  @Get('/send-email')
  sendInvitationEmail(@Body() sendInvitationDto: SendInvitationDto) {
    // get user id from jwt
    return this.classesService.sendEmailInviteTeacher(2, sendInvitationDto);
  }

  @Get('/:id')
  getClassDetail(@Param() params) {
    console.log(params.id);
    return this.classesService.getClassDetail(params.id);
  }
}
