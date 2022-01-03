import AssignmentsService from '@components/assignments/assignments.service';
import { ClassesService } from '@components/classes/classes.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateReviewDto from './dto/create-review.dto';
import GetReviewOfAssignmentOfStudentDto from './dto/get-review-of-assignment-of-student.dto';
import GetReviewsOfAssignmentDto from './dto/get-reviews-of-assignment.dto';
import GetReviewsOfClassDto from './dto/get-reviews-of-class.dto';
import ReviewEntity from './entities/reviews.entity';

@Injectable()
export default class ReviewsService {
  constructor(
    private readonly assignmentService: AssignmentsService,
    private readonly classesService: ClassesService,
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
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
}
