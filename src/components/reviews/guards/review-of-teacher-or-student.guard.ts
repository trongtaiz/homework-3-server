import { ClassesService } from '@components/classes/classes.service';
import UsersService from '@components/users/users.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import ReviewsService from '../review.service';

@Injectable()
export default class ReviewOfTeacherOrStudentGuard implements CanActivate {
  constructor(
    private readonly classesService: ClassesService,
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const reviewId =
      request.body.reviewId || request.body.id || request.query.reviewId;

    console.log(reviewId);

    if (!reviewId) return false;

    const review = await this.reviewsService.getReview(reviewId);

    if (!review) return false;

    console.log(review);

    const isTeacherOfClass = await this.classesService.isTeacherOfClass(
      request.user.id,
      review.classId,
    );

    if (isTeacherOfClass) {
      return true;
    }

    // is review of student?
    const isUserHasStudentId = await this.usersService.isUserHasStudentId(
      request.user.id,
      review.studentId,
    );

    return isUserHasStudentId;
  }
}
