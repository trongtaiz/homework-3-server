import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export default class GetReviewsOfAssignmentDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  assignmentId!: string;
}
