import { ClassesService } from '@components/classes/classes.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import AssignmentsService from '../assignments.service';

@Injectable()
export default class AssignmentOfStudentGuard implements CanActivate {
  constructor(
    private readonly classesService: ClassesService,
    private readonly assignmentsService: AssignmentsService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const assignmentId =
      request.body.assignmentId ||
      request.body.id ||
      request.query.assignmentId;

    console.log(assignmentId);
    if (!assignmentId) return false;

    const assignment = await this.assignmentsService.getAssignment(
      assignmentId,
    );
    console.log(assignment);
    if (!assignment) return false;

    const isStudentOfClass = await this.classesService.isStudentOfClass(
      request.user.id,
      assignment.classId,
    );

    if (isStudentOfClass) {
      request.body.classId = assignment.classId;
      request.query.classId = assignment.classId;
    }

    return isStudentOfClass;
  }
}
