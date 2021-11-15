import { ClassesService } from '@components/classes/classes.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export default class TeacherOfClassGuard implements CanActivate {
  constructor(private readonly classesService: ClassesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const classId =
      request.query.classId ||
      request.body.classId ||
      request.params.classId ||
      request.params.id;

    if (!classId) return false;

    const isTeacherOfClass = await this.classesService.isTeacherOfClass(
      classId,
      request.user.id,
    );

    return isTeacherOfClass;
  }
}
