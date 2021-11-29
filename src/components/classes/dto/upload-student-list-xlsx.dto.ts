import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export default class UploadStudentListXLSXDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  studentId!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  fullName!: string;
}
