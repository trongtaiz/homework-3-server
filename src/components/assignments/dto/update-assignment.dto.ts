import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export default class UpdateAssignmentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumberString()
  id!: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  point?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
