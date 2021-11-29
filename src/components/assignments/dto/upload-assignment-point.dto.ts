import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export default class UploadAssignmentPointDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  classId!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  assignmentId!: string;
}
