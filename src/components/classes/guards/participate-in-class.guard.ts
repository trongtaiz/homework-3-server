import { ClassesService } from '@components/classes/classes.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import StudentOfClassGuard from './student-of-class.guard';
import TeacherOfClassGuard from './teacher-of-class.guard';

@Injectable()
export default class ParticipateInClassGuard implements CanActivate {
  //   constructor(
  //     private moduleRef: ModuleRef,
  //   ) {}

  constructor(
    private readonly studentOfClassGuard: StudentOfClassGuard,
    private readonly teacherOfClassGuard: TeacherOfClassGuard,
  ) {}
  async canActivate(context: ExecutionContext) {
    // const studentOfClassGuard =
    //   this.moduleRef.get<CanActivate>(StudentOfClassGuard);

    // const teacherOfClassGuard =
    //   this.moduleRef.get<CanActivate>(TeacherOfClassGuard);

    const isStudentOfClass = await (this.studentOfClassGuard.canActivate(
      context,
    ) as Promise<boolean>);

    const isTeacherOfClass = await (this.teacherOfClassGuard.canActivate(
      context,
    ) as Promise<boolean>);

    // console.log(isStudentOfClass);
    // console.log(isTeacherOfClass);

    return isStudentOfClass || isTeacherOfClass;
  }
}
