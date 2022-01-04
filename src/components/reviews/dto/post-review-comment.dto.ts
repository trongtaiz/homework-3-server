import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export default class PostReviewCommentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  reviewId!: string;

  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  content!: string;
}
