import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export default class GetAssignmentsDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumberString()
  classId!: string;
}
