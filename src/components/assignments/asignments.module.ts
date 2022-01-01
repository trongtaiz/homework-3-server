import {
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

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignmentsEntity, AssignmentOfStudentEntity]),
    ClassesModule,
  ],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  exports: [AssignmentsService],
})
export default class AssignmentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ParseFormDataMiddleware).forRoutes({
      path: 'assignments/points/upload',
      method: RequestMethod.POST,
    });
  }
}
