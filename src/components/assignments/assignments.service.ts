import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { Repository } from 'typeorm';
import CreateAssignmentDto from './dto/create-assignment.dto';
import GetAssignmentsDto from './dto/get-assignments.dto';
import UpdateAssignmentDto from './dto/update-assignment.dto';
import AssignmentsEntity from './entities/assignments.entity';

@Injectable()
export default class AssignmentsService {
  constructor(
    @InjectRepository(AssignmentsEntity)
    private readonly assignmentsRepository: Repository<AssignmentsEntity>,
  ) {}

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
      this.assignmentsRepository.create({ ...dto, order: assignments.length }),
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
}
