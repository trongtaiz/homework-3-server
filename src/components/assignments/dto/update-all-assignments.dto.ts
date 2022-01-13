import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import UpdateAssignmentDto from './update-assignment.dto';

export default class UpdateAllAssignmentsDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumberString()
  classId!: string;

  assignments!: UpdateAssignmentDto[];
}
