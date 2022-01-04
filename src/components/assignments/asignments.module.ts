import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import AssignmentsEntity from './entities/assignments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssignmentsService from './assignments.service';
import AssignmentsController from './assignments.controller';
import { ClassesModule } from '@components/classes/classes.module';
import { ParseFormDataMiddleware } from 'src/middlewares/parse-form-data.middleware';
import AssignmentOfStudentEntity from './entities/assignment-student.entity';
import AssignmentOfTeacherGuard from './guards/assignment-of-teacher.guard';
import AssignmentOfStudentGuard from './guards/assignment-of-student.guard';
import UsersModule from '@components/users/users.module';
import AssignmentOfUploadedStudentGuard from './guards/assignment-of-uploaded-student.guard';
import AssignmentOfTeacherOrStudentGuard from './guards/assignment-of-teacher-or-student.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignmentsEntity, AssignmentOfStudentEntity]),
    forwardRef(() => ClassesModule),
    UsersModule,
  ],
  providers: [
    AssignmentsService,
    AssignmentOfTeacherGuard,
    AssignmentOfStudentGuard,
    AssignmentOfUploadedStudentGuard,
    AssignmentOfTeacherOrStudentGuard,
  ],
  controllers: [AssignmentsController],
  exports: [
    AssignmentsService,
    AssignmentOfTeacherGuard,
    AssignmentOfStudentGuard,
    AssignmentOfUploadedStudentGuard,
    AssignmentOfTeacherOrStudentGuard,
  ],
})
export default class AssignmentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseFormDataMiddleware).forRoutes({
      path: 'assignments/points/upload',
      method: RequestMethod.POST,
    });
  }
}
