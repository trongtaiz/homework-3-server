import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class UpdateAchievedPointDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  studentId!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  assignmentId!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  classId!: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  achievedPoint!: number;
}
