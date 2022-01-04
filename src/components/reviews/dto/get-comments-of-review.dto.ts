import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export default class GetAllCommentsOfReviewDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  reviewId!: string;
}
