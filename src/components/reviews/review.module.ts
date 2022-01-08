import AssignmentsModule from '@components/assignments/assignments.module';
import { ClassesModule } from '@components/classes/classes.module';
import UsersModule from '@components/users/users.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ReviewCommentEntity from './entities/review-comments.entity';
import ReviewEntity from './entities/reviews.entity';
import ReviewOfTeacherOrStudentGuard from './guards/review-of-teacher-or-student.guard';
import ReviewsService from './review.service';
import ReviewsController from './reviews.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewEntity, ReviewCommentEntity]),
    ClassesModule,
    AssignmentsModule,
    UsersModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewOfTeacherOrStudentGuard],
  exports: [ReviewsService, ReviewOfTeacherOrStudentGuard],
})
export default class ReviewsModule {}
