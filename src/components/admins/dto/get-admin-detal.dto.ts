import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class GetAdminDetailDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  adminId!: string;
}
