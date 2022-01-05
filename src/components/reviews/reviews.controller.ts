import AssignmentOfTeacherOrStudentGuard from '@components/assignments/guards/assignment-of-teacher-or-student.guard';
import AssignmentOfTeacherGuard from '@components/assignments/guards/assignment-of-teacher.guard';
import AssignmentOfUploadedStudentGuard from '@components/assignments/guards/assignment-of-uploaded-student.guard';
import TeacherOfClassGuard from '@components/classes/guards/teacher-of-class.guard';
import AuthUser from '@decorators/auth-user.decorator';
import JwtAccessGuard from '@guards/jwt-access.guard';
import WrapResponseInterceptor from '@interceptors/wrap-response.interceptor';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import CreateReviewDto from './dto/create-review.dto';
import FinalizeReviewDto from './dto/finalize-review.dto';
import GetAllCommentsOfReviewDto from './dto/get-comments-of-review.dto';
import GetReviewOfAssignmentOfStudentDto from './dto/get-review-of-assignment-of-student.dto';
import GetReviewsOfAssignmentDto from './dto/get-reviews-of-assignment.dto';
import GetReviewsOfClassDto from './dto/get-reviews-of-class.dto';
import PostReviewCommentDto from './dto/post-review-comment.dto';
import ReviewOfTeacherOrStudentGuard from './guards/review-of-teacher-or-student.guard';
import ReviewsService from './review.service';

@ApiTags('Reviews')
@UseInterceptors(WrapResponseInterceptor)
@Controller('reviews')
export default class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @ApiBody({ type: CreateReviewDto })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, AssignmentOfUploadedStudentGuard)
  @Post()
  async requestReviewAssignment(@Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(dto);
  }

  @ApiQuery({ type: GetReviewsOfClassDto })
  @ApiBearerAuth()
  @Get('class')
  @UseGuards(JwtAccessGuard, TeacherOfClassGuard)
  async getAllReviewsOfClass(@Query() dto: GetReviewsOfClassDto) {
    return this.reviewsService.getAllReviewsOfClass(dto);
  }

  @ApiQuery({ type: GetReviewsOfAssignmentDto })
  @ApiBearerAuth()
  @Get('assignment')
  @UseGuards(JwtAccessGuard, AssignmentOfTeacherGuard)
  async getAllReviewsOfAssignment(@Query() dto: GetReviewsOfAssignmentDto) {
    return this.reviewsService.getAllReviewsOfAssignment(dto);
  }

  @ApiQuery({ type: GetReviewOfAssignmentOfStudentDto })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, AssignmentOfTeacherOrStudentGuard)
  @Get('assignment/student')
  async getReviewOfAssignmentOfStudent(
    @Query() dto: GetReviewOfAssignmentOfStudentDto,
  ) {
    return this.reviewsService.getReviewOfAssignmentOfStudent(dto);
  }

  @ApiBody({ type: PostReviewCommentDto })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, ReviewOfTeacherOrStudentGuard)
  @Post('comments')
  async postReviewComment(
    @AuthUser() user: any,
    @Body() dto: PostReviewCommentDto,
  ) {
    return this.reviewsService.postReviewComment(user.id, dto);
  }

  @ApiQuery({ type: GetAllCommentsOfReviewDto })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, ReviewOfTeacherOrStudentGuard)
  @Get('comments')
  async getAllCommentsOfReview(@Query() dto: GetAllCommentsOfReviewDto) {
    return this.reviewsService.getAllCommentsOfReview(dto);
  }

  @ApiBody({ type: FinalizeReviewDto })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard, ReviewOfTeacherOrStudentGuard)
  @Post('finalize')
  async finalizeReview(@Body() dto: FinalizeReviewDto) {
    return this.reviewsService.finalizeReview(dto);
  }
}
