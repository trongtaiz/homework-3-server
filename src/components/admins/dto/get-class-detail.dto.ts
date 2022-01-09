import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class GetClassDetailDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  classId!: string;
}
