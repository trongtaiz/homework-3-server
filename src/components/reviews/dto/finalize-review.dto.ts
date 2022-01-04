import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class FinalizeReviewDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  reviewId!: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsNotEmpty()
  finalGrade!: number;
}
