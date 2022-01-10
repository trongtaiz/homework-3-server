import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class GetClassesOfUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
