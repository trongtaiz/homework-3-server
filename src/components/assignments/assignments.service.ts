import { ClassesService } from '@components/classes/classes.service';
import { NotificationsService } from '@components/notifications/notifications.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import CreateAssignmentDto from './dto/create-assignment.dto';
import FinalizeAssignmentDto from './dto/finalize-assignment.dto';
import UpdateAllAssignmentsDto from './dto/update-all-assignments.dto';
import UpdateAssignmentDto from './dto/update-assignment.dto';
import AssignmentOfStudentEntity from './entities/assignment-student.entity';
import AssignmentsEntity from './entities/assignments.entity';

@Injectable()
export default class AssignmentsService {
  constructor(
    @InjectRepository(AssignmentsEntity)
    private readonly assignmentsRepository: Repository<AssignmentsEntity>,
    @InjectRepository(AssignmentOfStudentEntity)
    private readonly assignmentOfStudentRepository: Repository<AssignmentOfStudentEntity>,
    private readonly notificationsService: NotificationsService,
    private readonly classesService: ClassesService,
  ) {}

  getAssignmentRepository() {
    return this.assignmentsRepository;
  }

  getAssignmentOfStudentRepository() {
    return this.assignmentOfStudentRepository;
  }

  async getOfClass(classId: string) {
    const assignments = await this.assignmentsRepository.find({
      where: { classId },
      order: {
        order: 'ASC',
      },
    });

    return assignments;
  }

  async createAssignment(dto: CreateAssignmentDto) {
    const assignments = await this.assignmentsRepository.find({
      classId: dto.classId,
    });

    const newAssignment = await this.assignmentsRepository.save(
      this.assignmentsRepository.create(dto),
    );

    return newAssignment;
  }

  async updateAssignment(dto: UpdateAssignmentDto) {
    await this.assignmentsRepository.update(
      { id: dto.id },
      _.omit(dto, ['id']),
    );

    return this.assignmentsRepository.findOne(dto.id);
  }

  async updateAllAssignments(dto: UpdateAllAssignmentsDto) {
    console.log('UpdateAllAssignmentsDto', dto);
    const assignments = await this.assignmentsRepository.find({
      classId: dto.classId,
    });

    const currentIds = assignments.map((assignment) => assignment.id);
    const newIds = dto.assignments.map((assignment) => assignment.id);

    for (const item of currentIds) {
      if (!newIds.includes(item)) {
        console.log('deleteAssignment', item);
        this.deleteAssignment(item);
      }
    }
    for (let i = 0; i < newIds.length; i++) {
      if (newIds[i] == 'new') {
        const { title, point, order } = dto.assignments[i];
        console.log('createAssignment', title);
        this.createAssignment({
          classId: dto.classId,
          title: title || '',
          point: point || 0,
          order: order || 0,
        });
      } else this.updateAssignment(dto.assignments[i]);
    }
  }

  async isAssignmentOfClass(assignmentId: string, classId: string) {
    const assignment = await this.assignmentsRepository.findOne(assignmentId);

    if (!assignment) return false;

    return assignment.classId === classId;
  }

  async getAssignment(id: string) {
    return this.assignmentsRepository.findOne(id);
  }

  async deleteAssignment(id: string) {
    const deleteResult = await this.assignmentsRepository.delete(id);

    if (deleteResult.affected === 0) throw new BadRequestException();
    return { message: 'Assignment deleted successfully' };
  }

  async upsertAssignmentPoints(
    classId: string,
    assignmentId: string,
    points: {
      studentId: string;
      achievedPoint: number;
    }[],
  ) {
    return this.assignmentOfStudentRepository.save(
      this.assignmentOfStudentRepository.create(
        points.map((e) => ({
          ...e,
          assignmentId,
          classId,
        })),
      ),
    );
  }

  async updateAchievedPoint(
    classId: string,
    assignmentId: string,
    studentId: string,
    achievedPoint: number,
  ) {
    return this.assignmentOfStudentRepository.save(
      this.assignmentOfStudentRepository.create({
        classId,
        assignmentId,
        studentId,
        achievedPoint,
      }),
    );
  }

  async finalizeAssignment(dto: FinalizeAssignmentDto) {
    const savedAssignment = await this.assignmentsRepository.save({
      id: dto.assignmentId,
      isFinalized: dto.isFinalized,
    });

    const assignment = await this.assignmentsRepository.findOne({
      id: dto.assignmentId,
    });

    const allStudentsOfClass = await this.classesService.getStudentsInClass(
      assignment!.classId,
    );

    if (dto.isFinalized) {
      // send push noti
      for (const student of allStudentsOfClass) {
        await this.notificationsService.createNotification({
          classId: assignment!.classId,
          receiverId: student.user_id,
          message: `Assignment ${
            assignment!.title
          } has been finalized, go to see your grade`,
          subject: 'Your teacher has finalized one assignment',
          link: `/classes/${assignment!.classId}/grade`,
        });
      }
    }

    return assignment;
  }
}
