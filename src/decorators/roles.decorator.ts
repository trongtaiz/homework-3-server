import { SetMetadata } from '@nestjs/common';

export enum RolesEnum {
  teacher = 'teacher',
  student = 'student'
}

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
