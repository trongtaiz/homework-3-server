import { ApiProperty } from '@nestjs/swagger/dist';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export default class GetPointsOfStudentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  studentId!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  classId!: string;
}
