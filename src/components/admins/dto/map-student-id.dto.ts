import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export default class MapStudentIdDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  studentId?: string;
}
