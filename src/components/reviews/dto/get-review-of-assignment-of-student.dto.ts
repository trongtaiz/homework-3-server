import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class GetReviewOfAssignmentOfStudentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  assignmentId!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  @Type(() => String)
  studentId!: string;
}
