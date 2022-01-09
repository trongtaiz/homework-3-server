import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export default class LockUserDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty({ type: Boolean })
  @IsNotEmpty()
  @IsBoolean()
  isLocked!: boolean;
}
