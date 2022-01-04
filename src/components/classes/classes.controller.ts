import AuthUser from '@decorators/auth-user.decorator';
import JwtAccessGuard from '@guards/jwt-access.guard';
import TeacherOfClassGuard from '@components/classes/guards/teacher-of-class.guard';
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
  BadRequestException,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/createClass.dto';
import { SendInvitationDto } from './dto/sendInvitation.dto';

import * as xlsx from 'xlsx';
import { plainToClass } from 'class-transformer';

import { validateSync } from 'class-validator';
import express from 'express';
import UploadStudentListXLSXDto from './dto/upload-student-list-xlsx.dto';
import UploadStudentListDto from './dto/upload-student-list.dto';
import GetPointsOfStudentDto from './dto/get-points-of-student.dto';
import StudentOfClassGuard from './guards/student-of-class.guard';

@ApiTags('Classes')
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
  changeStudentId(@Query('userId') userId, @Query('studentId') studentId) {
    console.log('query', userId, studentId);
    return this.classesService.changeStudentId(userId, studentId);
  }
  @Get('/fetchStudentId/')
  fetchStudentId(@Query('userId') userId) {
    console.log('query', userId);
    return this.classesService.fetchStudentId(userId);
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

  @Post('students/upload')
  @UseGuards(JwtAccessGuard, TeacherOfClassGuard)
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     // storage: diskStorage({
  //     //   destination: 'uploads/grades',
  //     //   filename: (req, file, cb) => {
  //     //     cb(null, `${req.body.classId}.xlsx`);
  //     //   },
  //     // }),
  //     storage: memoryStorage(),
  //   }),
  // )
  async uploadStudentList(
    @Body() { classId }: UploadStudentListDto,
    // @UploadedFile() file: Express.Multer.File,
    @Request() req: express.Request,
  ) {
    const workbook = xlsx.read((req.files as any[])[0].buffer, {
      type: 'buffer',
    });
    const parsed = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    ) as { studentId: string; fullName: string }[];

    console.log(parsed);
    let students = plainToClass(UploadStudentListXLSXDto, parsed);
    students.forEach((student) => {
      const errors = validateSync(student);
      if (errors.length > 0) {
        console.log(errors);
        throw new BadRequestException('Invalid input format');
      }
    });

    return this.classesService.upsertAllStudentsOfClass(classId, students);
  }

  @UseGuards(JwtAccessGuard, TeacherOfClassGuard)
  @Get('assignments/all/points')
  async getAllAssignmentPoints(@Query('classId') classId: string) {
    return this.classesService.getAllAssignmentPoints(classId);
  }

  @UseGuards(JwtAccessGuard, StudentOfClassGuard)
  @Get('student/points')
  async getAllPointsOfStudent(@Query() dto: GetPointsOfStudentDto) {
    return this.classesService.getAllPointsOfStudentOfClass(dto);
  }
}
