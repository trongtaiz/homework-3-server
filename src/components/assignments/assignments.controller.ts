import JwtAccessGuard from '@guards/jwt-access.guard';
import ParticipateInClassGuard from '@components/classes/guards/participate-in-class.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import AssignmentsService from './assignments.service';
import CreateAssignmentDto from './dto/create-assignment.dto';
import GetAssignmentsDto from './dto/get-assignments.dto';
import UpdateAssignmentDto from './dto/update-assignment.dto';
import TeacherOfClassGuard from '@components/classes/guards/teacher-of-class.guard';
import AssignmentOfClassOfTeacherGuard from './guards/assignment-of-class-of-teacher.guard';
import RemoveAssignmentDto from './dto/remove-assignment-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import * as xlsx from 'xlsx';
import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import UploadAssignmentPointXLSXDto from './dto/upload-assignment-point-xlsx.dto';
import UploadAssignmentPointDto from './dto/upload-assignment-point.dto';
import UpdateAchievedPointDto from './dto/update-achieved-point.dto';
import express from 'express';
@ApiTags('Assignments')
@Controller('assignments')
export default class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseInterceptors(WrapResponseInterceptor)
  // @UseGuards(JwtAccessGuard, ParticipateInClassGuard)
  @Get()
  async getAssignments(@Query() dto: GetAssignmentsDto) {
    return this.assignmentsService.getOfClass(dto.classId);
  }

  @UseInterceptors(WrapResponseInterceptor)
  @UseGuards(JwtAccessGuard, TeacherOfClassGuard)
  @Post()
  async createAssignment(@Body() dto: CreateAssignmentDto) {
    return this.assignmentsService.createAssignment(dto);
  }

  @UseInterceptors(WrapResponseInterceptor)
  @UseGuards(JwtAccessGuard, AssignmentOfClassOfTeacherGuard)
  @Patch()
  async updateAssignment(@Body() dto: UpdateAssignmentDto) {
    // Logger.log(
    //   'updateAssignmentDto: ' +
    //     JSON.stringify(dto, (k, v) => (v === undefined ? null : v)),
    // );

    return this.assignmentsService.updateAssignment(dto);
  }

  @UseInterceptors(WrapResponseInterceptor)
  @UseGuards(JwtAccessGuard, AssignmentOfClassOfTeacherGuard)
  @Delete()
  async removeAssignment(@Body() dto: RemoveAssignmentDto) {
    return this.assignmentsService.deleteAssignment(dto.id);
  }

  @Post('points/upload')
  @UseGuards(JwtAccessGuard, AssignmentOfClassOfTeacherGuard)
  @UseInterceptors(WrapResponseInterceptor)
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
  async uploadAssignmentPoints(
    @Body() { classId, assignmentId }: UploadAssignmentPointDto,
    // @UploadedFile() file: Express.Multer.File,
    @Request() req: express.Request,
  ) {
    const workbook = xlsx.read((req.files as any[])[0].buffer, {
      type: 'buffer',
    });
    const parsed = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    ) as { studentId: string; achievedPoint: number }[];

    console.log(parsed);
    let points = plainToClass(UploadAssignmentPointXLSXDto, parsed);
    points.forEach((point) => {
      const errors = validateSync(point);
      if (errors.length > 0) {
        console.log(errors);
        throw new BadRequestException('Invalid input format');
      }
    });

    return this.assignmentsService.upsertAssignmentPoints(
      classId,
      assignmentId,
      points,
    );
  }

  @UseGuards(JwtAccessGuard, AssignmentOfClassOfTeacherGuard)
  @Patch('points')
  async updateAchievedPoint(
    @Body()
    {
      classId,
      assignmentId,
      studentId,
      achievedPoint: newPoint,
    }: UpdateAchievedPointDto,
  ) {
    return this.assignmentsService.updateAchievedPoint(
      classId,
      assignmentId,
      studentId,
      newPoint,
    );
  }
}
