import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UploadAssignmentPointXLSXDto {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  studentId!: string;

  @IsNotEmpty()
  @IsNumber()
  achievedPoint!: number;
}
