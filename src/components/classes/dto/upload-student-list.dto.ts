import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export default class UploadStudentListDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  classId!: string;
}
