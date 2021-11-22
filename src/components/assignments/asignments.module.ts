import { Module } from '@nestjs/common';
import AssignmentsEntity from './entities/assignments.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import AssignmentsService from './assignments.service';
import AssignmentsController from './assignments.controller';
import { ClassesModule } from '@components/classes/classes.module';

@Module({
  imports: [TypeOrmModule.forFeature([AssignmentsEntity]), ClassesModule],
  providers: [AssignmentsService],
  controllers: [AssignmentsController],
  exports: [AssignmentsService],
})
export default class AssignmentsModule {}
