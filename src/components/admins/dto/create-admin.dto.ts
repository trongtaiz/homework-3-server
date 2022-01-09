import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import AdminSignInDto from './admin-sign-in.dto';

export default class CreateAdminDto extends AdminSignInDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name!: string;
}
