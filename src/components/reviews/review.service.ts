import AssignmentsService from '@components/assignments/assignments.service';
import { ClassesService } from '@components/classes/classes.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import CreateReviewDto from './dto/create-review.dto';
import FinalizeReviewDto from './dto/finalize-review.dto';
import GetAllCommentsOfReviewDto from './dto/get-comments-of-review.dto';
import GetReviewOfAssignmentOfStudentDto from './dto/get-review-of-assignment-of-student.dto';
import GetReviewsOfAssignmentDto from './dto/get-reviews-of-assignment.dto';
import GetReviewsOfClassDto from './dto/get-reviews-of-class.dto';
import PostReviewCommentDto from './dto/post-review-comment.dto';
import ReviewCommentEntity from './entities/review-comments.entity';
import ReviewEntity from './entities/reviews.entity';

@Injectable()
export default class ReviewsService {
  constructor(
    private readonly assignmentService: AssignmentsService,
    private readonly classesService: ClassesService,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(ReviewCommentEntity)
    private readonly reviewCommentRepository: Repository<ReviewCommentEntity>,
  ) {}

  async createReview(dto: CreateReviewDto) {
    const newReview = this.reviewRepository.create({
      assignmentId: dto.assignmentId,
      studentId: dto.studentId,
      classId: dto.classId,
      expectedGrade: dto.expectedGrade,
      explanation: dto.explanation,
    });

    return this.reviewRepository.save(newReview);
  }

  async getAllReviewsOfClass(dto: GetReviewsOfClassDto) {
    return this.reviewRepository.find({
      where: {
        classId: dto.classId,
      },
      relations: ['assignmentOfStudent', 'assignmentOfStudent.student'],
    });
  }

  async getAllReviewsOfAssignment(dto: GetReviewsOfAssignmentDto) {
    return this.reviewRepository.find({
      where: {
        assignmentId: dto.assignmentId,
      },
      relations: ['assignmentOfStudent', 'assignmentOfStudent.student'],
    });
  }

  async getReviewOfAssignmentOfStudent(dto: GetReviewOfAssignmentOfStudentDto) {
    return this.reviewRepository.find({
      where: {
        assignmentId: dto.assignmentId,
        studentId: dto.studentId,
      },
      relations: ['assignmentOfStudent', 'assignmentOfStudent.student'],
    });
  }

  async getReview(reviewId: string) {
    return this.reviewRepository.findOne({ id: reviewId });
  }

  async postReviewComment(userId: string, dto: PostReviewCommentDto) {
    return this.reviewCommentRepository.save(
      this.reviewCommentRepository.create({ ...dto, from: userId }),
    );
  }

  async getAllCommentsOfReview(dto: GetAllCommentsOfReviewDto) {
    const comments = await this.reviewCommentRepository.find({
      where: {
        reviewId: dto.reviewId,
      },
      order: {
        createdAt: 'ASC',
      },
    });

    const participants = await this.getParticipantsOfReview(dto.reviewId);
    return { comments, participants };
  }

  async finalizeReview(dto: FinalizeReviewDto) {
    return this.reviewRepository.save({
      id: dto.reviewId,
      finalGrade: dto.finalGrade,
    });
  }

  async getParticipantsOfReview(reviewId: string) {
    const review = await this.reviewRepository.findOne({
      where: {
        id: reviewId,
      },
      relations: ['student'],
    });

    console.log(review);

    // get teachers
    const teachers = await this.classesService.getTeachersInClass(
      review!.classId,
    );

    console.log(teachers);

    const participants = {};

    teachers.forEach((e) => {
      participants[e.user_id] = _.pick(e.user, ['name', 'id']);
    });
    participants[review!.student!.id] = _.pick(review!.student, ['name', 'id']);
    return participants;
  }
}
