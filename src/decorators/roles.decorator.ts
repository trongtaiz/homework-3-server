import { SetMetadata } from '@nestjs/common';

export enum RolesEnum {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);
