import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';

export default class CreateAssignmentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumberString()
  classId!: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber({})
  point!: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber({})
  order!: number;
}
