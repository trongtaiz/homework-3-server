import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export default class RemoveAssignmentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsNumberString()
  id!: string;
}
