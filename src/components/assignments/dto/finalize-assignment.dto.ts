import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export default class FinalizeAssignmentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumberString()
  assignmentId!: string;
}
