import { ClassesService } from '@components/classes/classes.service';
import UsersService from '@components/users/users.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import AssignmentsService from '../assignments.service';

@Injectable()
export default class AssignmentOfTeacherOrStudentGuard implements CanActivate {
  constructor(
    private readonly classesService: ClassesService,
    private readonly assignmentsService: AssignmentsService,
    private readonly usersService: UsersService,
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
    if (!assignment) return false;

    console.log(assignment);

    const isTeacherOfClass = await this.classesService.isTeacherOfClass(
      request.user.id,
      assignment.classId,
    );

    if (isTeacherOfClass) {
      request.body.classId = assignment.classId;
      return true;
    }

    // is assignment of student?
    const user = await this.usersService.getUserInfo(request.user.id);
    if (!user.studentId) return false;

    const isUploadedStudentOfClass =
      await this.classesService.isUploadedStudentOfClass(
        user.studentId,
        assignment.classId,
      );

    if (isUploadedStudentOfClass) {
      request.body.classId = assignment.classId;
      request.body.studentId = user.studentId;

      request.query.classId = assignment.classId;
      request.query.studentId = user.studentId;
    }

    return isUploadedStudentOfClass;
  }
}
