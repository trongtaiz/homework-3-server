import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class GetUserDetailDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
