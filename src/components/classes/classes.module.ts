import { Classes } from './entities/classes.entity';
import { StudentClass } from './entities/studentClass.entity';
import { TeacherClass } from './entities/teacherClass.entity';
import UserEntity from '@components/users/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClassesController } from './classes.controller';
import { ClassesService } from '@components/classes/classes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '@utils/mail.util';
import ParticipateInClassGuard from '@components/classes/guards/participate-in-class.guard';
import StudentOfClassGuard from '@components/classes/guards/student-of-class.guard';
import TeacherOfClassGuard from '@components/classes/guards/teacher-of-class.guard';
import { ParseFormDataMiddleware } from 'src/middlewares/parse-form-data.middleware';
import UploadedStudentsEntity from './entities/uploaded-students.entity';
import UsersModule from '@components/users/users.module';
import AssignmentsModule from '@components/assignments/assignments.module';
import AssignmentOfStudentEntity from '@components/assignments/entities/assignment-student.entity';
import AssignmentsEntity from '@components/assignments/entities/assignments.entity';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([
      Classes,
      StudentClass,
      TeacherClass,
      UserEntity,
      UploadedStudentsEntity,
      AssignmentOfStudentEntity,
      AssignmentsEntity,
    ]),
    MailModule,
    UsersModule,
    // forwardRef(() => AssignmentsModule),
  ],
  controllers: [ClassesController],
  providers: [
    ClassesService,
    StudentOfClassGuard,
    TeacherOfClassGuard,
    ParticipateInClassGuard,
  ],
  exports: [
    ClassesService,
    StudentOfClassGuard,
    TeacherOfClassGuard,
    ParticipateInClassGuard,
  ],
})
export class ClassesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseFormDataMiddleware).forRoutes({
      path: 'classes/students/upload',
      method: RequestMethod.POST,
    });
  }
}
