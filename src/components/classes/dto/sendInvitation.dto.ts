import { RolesEnum } from '@decorators/roles.decorator';

export class SendInvitationDto {
  userEmail!: string;
  role!: RolesEnum;
  classId!: number;
}
