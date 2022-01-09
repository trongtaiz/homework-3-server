import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export default class GetAllAdminsDto {
  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ type: String, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  keyword?: string;

  @ApiProperty({ type: String, required: false })
  @IsString()
  @IsOptional()
  @IsIn(['-createdAt', 'createdAt', '+createdAt'])
  sortBy?: string;
}
