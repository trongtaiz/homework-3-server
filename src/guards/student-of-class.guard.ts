import { ClassesService } from '@components/classes/classes.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export default class StudentOfClassGuard implements CanActivate {
  constructor(private readonly classesService: ClassesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const classId =
      request.query.classId ||
      request.body.classId ||
      request.params.classId ||
      request.params.id;

    if (!classId) return false;

    const isStudentOfClass = await this.classesService.isStudentOfClass(
      request.user.id,
      classId,
    );

    return isStudentOfClass;
  }
}
