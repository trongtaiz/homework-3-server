import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';
export class UpdateNotificationDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumberString()
  id!: string;

  @ApiProperty({ type: Boolean })
  seen!: boolean;
}
