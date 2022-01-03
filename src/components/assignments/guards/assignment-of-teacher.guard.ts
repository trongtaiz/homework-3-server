import { ClassesService } from '@components/classes/classes.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import AssignmentsService from '../assignments.service';

@Injectable()
export default class AssignmentOfTeacherGuard implements CanActivate {
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

    if (!assignmentId) return false;

    const assignment = await this.assignmentsService.getAssignment(
      assignmentId,
    );
    if (!assignment) return false;

    const isTeacherOfClass = await this.classesService.isTeacherOfClass(
      request.user.id,
      assignment.classId.toString(),
    );

    if (isTeacherOfClass) {
      request.body.classId = assignment.classId;
      request.query.classId = assignment.classId;
    }

    return isTeacherOfClass;
  }
}
