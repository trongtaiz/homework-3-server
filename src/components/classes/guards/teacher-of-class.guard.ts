import { ClassesService } from '@components/classes/classes.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as multer from 'multer';

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
      request.user.id,
      classId,
    );

    return isTeacherOfClass;
  }
}
