import AssignmentsService from '@components/assignments/assignments.service';
import { ClassesService } from '@components/classes/classes.service';
import { NotificationsService } from '@components/notifications/notifications.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import CreateReviewDto from './dto/create-review.dto';
import FinalizeReviewDto from './dto/finalize-review.dto';
import GetAllReviewOfStudentDto from './dto/get-all-review-in-a-class-of-student.dto';
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
    private readonly notificationsService: NotificationsService,
  ) {}

  async createReview(dto: CreateReviewDto) {
    const newReview = await this.reviewRepository.save(
      this.reviewRepository.create({
        assignmentId: dto.assignmentId,
        studentId: dto.studentId,
        classId: dto.classId,
        expectedGrade: dto.expectedGrade,
        explanation: dto.explanation,
      }),
    );

    const teachers = await this.classesService.getTeachersInClass(
      newReview.classId,
    );

    // send push noti
    for (const teacher of teachers) {
      await this.notificationsService.createNotification({
        receiverId: teacher.user_id,
        classId: newReview.classId,
        message: 'A new review has been requested',
        subject: 'A new review has been requested',
        link: `classes/${newReview.classId}/review-detail/${newReview.id}`,
      });
    }

    return newReview;
  }

  async getReviewDetail(id: string) {
    return this.reviewRepository.findOne({
      where: { id: id },
      relations: [
        'assignmentOfStudent',
        'assignmentOfStudent.student',
        'assignmentOfStudent.detail',
      ],
    });
  }

  async getAllReviewsOfClass(dto: GetReviewsOfClassDto) {
    return this.reviewRepository.find({
      where: {
        classId: dto.classId,
      },
      relations: [
        'assignmentOfStudent',
        'assignmentOfStudent.student',
        'assignmentOfStudent.detail',
      ],
    });
  }

  async getAllReviewsOfAssignment(dto: GetReviewsOfAssignmentDto) {
    return this.reviewRepository.find({
      where: {
        assignmentId: dto.assignmentId,
      },
      relations: [
        'assignmentOfStudent',
        'assignmentOfStudent.student',
        'assignmentOfStudent.detail',
      ],
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

  async getAllRequestedReviewOfStudent(dto: GetAllReviewOfStudentDto) {
    return this.reviewRepository.find({
      where: {
        studentId: dto.studentId,
        classId: dto.classId,
      },
      relations: [
        'assignmentOfStudent',
        'assignmentOfStudent.student',
        'assignmentOfStudent.detail',
      ],
    });
  }

  async getReview(reviewId: string) {
    return this.reviewRepository.findOne({ id: reviewId });
  }

  async postReviewComment(userId: string, dto: PostReviewCommentDto) {
    const comment = await this.reviewCommentRepository.save(
      this.reviewCommentRepository.create({ ...dto, from: userId }),
    );

    const review = await this.reviewRepository.findOne({
      where: {
        id: comment.reviewId,
      },
      relations: ['student'],
    });

    const assignment = await this.assignmentService
      .getAssignmentRepository()
      .findOne({ id: review!.assignmentId });

    const teachers = await this.classesService.getTeachersInClass(
      review!.classId,
    );
    const participants = [
      ...teachers.map((e) => e.user_id),
      review!.student!.id,
    ];

    // send push noti in real-time
    for (const pId of participants) {
      if (pId !== comment.from) {
        await this.notificationsService.createNotification({
          subject: `New comment on review`,
          message: `New comment on review of assignment ${assignment?.title}`,
          classId: assignment!.classId,
          receiverId: pId,
          link: `/classes/${assignment!.classId}/review-detail/${review!.id}`,
        });
      }
    }

    return comment;
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
    const review = await this.reviewRepository.findOne({
      where: { id: dto.reviewId },
      relations: ['assignmentOfStudent', 'student'],
    });

    await this.reviewRepository.save({
      id: dto.reviewId,
      prevGrade: review?.assignmentOfStudent?.achievedPoint,
      finalGrade: dto.finalGrade,
    });

    const assignmentOfStudent = await this.assignmentService
      .getAssignmentOfStudentRepository()
      .save({
        studentId: review!.studentId,
        assignmentId: review!.assignmentId,
        achievedPoint: dto.finalGrade,
      });

    // send push noti
    await this.notificationsService.createNotification({
      classId: review!.classId,
      receiverId: review!.student!.id,
      message: 'Your teacher has finalize a decision on your review',
      subject: 'A decision on your review',
      link: `classes/${review!.classId}/review-detail/${review!.id}`,
    });

    return assignmentOfStudent;
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
