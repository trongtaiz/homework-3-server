import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class AdminSignInDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  email!: string;
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  password!: string;
}
