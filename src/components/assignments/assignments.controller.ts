import JwtAccessGuard from '@guards/jwt-access.guard';
import ParticipateInClassGuard from '@components/classes/guards/participate-in-class.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Patch,
  Post,
  Query,
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

@ApiTags('Assignments')
@Controller('assignments')
export default class AssignmentsController {
  constructor(private readonly assignmentsService: AssignmentsService) {}

  @UseInterceptors(WrapResponseInterceptor)
  @UseGuards(JwtAccessGuard, ParticipateInClassGuard)
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
}
